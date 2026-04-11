import {
  getAmenities,
  getFacilities,
  getFilteredProperties,
  getProperties,
  getPropertyTypes,
  searchProperties,
} from "@/api/property";

let cachedPropertyTypes = null;
let cachedAmenities = null;
let cachedFacilities = null;
const HOME_LISTINGS_CACHE_TTL_MS = 60 * 1000;
const homeListingsCache = new Map();

function normalizeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeOwnerVerificationStatus(property) {
  const raw =
    property?.owner_verification_status ??
    property?.verification_status ??
    property?.owner_status ??
    null;

  const status = String(raw || "unverified").toLowerCase().trim();
  return ["verified", "pending", "rejected", "unverified"].includes(status)
    ? status
    : "unverified";
}

function normalizeProperty(property) {
  const normalizedStatus = normalizeOwnerVerificationStatus(property);
  const totalReviews = normalizeNumber(
    property?.total_reviews ?? property?.review_count ?? 0
  );
  const averageRating = Number(
    normalizeNumber(property?.average_rating ?? property?.avg_rating ?? 0).toFixed(1)
  );

  return {
    ...property,
    average_rating_value: averageRating,
    total_reviews_value: totalReviews,
    owner_verification_status_normalized: normalizedStatus,
    owner_verification_label:
      normalizedStatus === "verified"
        ? "Verified Owner"
        : normalizedStatus === "pending"
          ? "Verification Pending"
          : normalizedStatus === "rejected"
            ? "Verification Rejected"
            : "Unverified Owner",
    owner_verification_badge_class:
      normalizedStatus === "verified"
        ? "bg-success-subtle text-success"
        : normalizedStatus === "pending"
          ? "bg-warning-subtle text-warning-emphasis"
          : normalizedStatus === "rejected"
            ? "bg-danger-subtle text-danger"
            : "bg-secondary-subtle text-secondary",
  };
}

function isPropertyVisible(property) {
  const status = String(property?.status || "").toLowerCase();
  return property?.is_available !== false && status !== "pending";
}

function normalizePaginatedResponse(response) {
  const paginated = response?.data?.properties || {};
  const data = Array.isArray(paginated.data) ? paginated.data : [];
  const visibleProperties = data.filter(isPropertyVisible).map(normalizeProperty);

  return {
    properties: visibleProperties,
    currentPage: Number(paginated.current_page || 1),
    lastPage: Number(paginated.last_page || 1),
    total: Number(paginated.total || visibleProperties.length || 0),
  };
}

function cloneValue(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function buildListingsCacheKey({ page = 1, query = "", filters = {} } = {}) {
  return JSON.stringify({
    page: Number(page || 1),
    query: String(query || "").trim().toLowerCase(),
    amenities: [...(filters.amenities || [])].map(Number).sort((a, b) => a - b),
    facilities: [...(filters.facilities || [])].map(Number).sort((a, b) => a - b),
    selectedType: filters.selectedType ?? null,
    selectedAgreement: filters.selectedAgreement || "",
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
  });
}

function getCachedListings(key) {
  const entry = homeListingsCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    homeListingsCache.delete(key);
    return null;
  }

  return cloneValue(entry.data);
}

function setCachedListings(key, data) {
  homeListingsCache.set(key, {
    data: cloneValue(data),
    expiresAt: Date.now() + HOME_LISTINGS_CACHE_TTL_MS,
  });
}

export function hasActiveHomeFilters(filters = {}) {
  return Boolean(
    (filters.amenities && filters.amenities.length) ||
      (filters.facilities && filters.facilities.length) ||
      filters.selectedType ||
      filters.selectedAgreement ||
      filters.minPrice ||
      filters.maxPrice
  );
}

export async function fetchHomeListings({
  page = 1,
  query = "",
  filters = {},
  force = false,
} = {}) {
  const cacheKey = buildListingsCacheKey({ page, query, filters });
  if (!force) {
    const cached = getCachedListings(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const trimmedQuery = String(query || "").trim();
  let result;

  if (trimmedQuery) {
    const response = await searchProperties(trimmedQuery, page);
    result = normalizePaginatedResponse(response);
    setCachedListings(cacheKey, result);
    return result;
  }

  if (hasActiveHomeFilters(filters)) {
    const response = await getFilteredProperties(
      filters.amenities || [],
      filters.facilities || [],
      filters.minPrice || null,
      filters.maxPrice || null,
      filters.selectedType || null,
      filters.selectedAgreement || null,
      page
    );

    result = normalizePaginatedResponse(response);
    setCachedListings(cacheKey, result);
    return result;
  }

  const response = await getProperties(page);
  result = normalizePaginatedResponse(response);
  setCachedListings(cacheKey, result);
  return result;
}

export async function loadHomeFilterOptions({
  includeExtended = false,
  force = false,
} = {}) {
  const tasks = [];

  if (force || !cachedPropertyTypes) {
    tasks.push(
      getPropertyTypes().then((types) => {
        cachedPropertyTypes = [
          { id: null, type_name: "Property Types" },
          ...types,
        ];
      })
    );
  }

  if (includeExtended && (force || !cachedAmenities)) {
    tasks.push(
      getAmenities().then((amenities) => {
        cachedAmenities = amenities;
      })
    );
  }

  if (includeExtended && (force || !cachedFacilities)) {
    tasks.push(
      getFacilities().then((facilities) => {
        cachedFacilities = facilities;
      })
    );
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }

  return {
    propertyTypes: cachedPropertyTypes || [{ id: null, type_name: "Property Types" }],
    amenities: cachedAmenities || [],
    facilities: cachedFacilities || [],
  };
}
