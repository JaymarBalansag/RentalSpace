import api from "./api";
import qs from "qs";

export async function isSubscribing(first_name, last_name, email) {
  const res = await api.post("/is-subscribing",{
    first_name: first_name,
    last_name: last_name,
    email: email
  });
  return res;
}
// Addresses
export async function getRegion() {
  const res = await api.get("/regions");
  return res.data;
}

// Provinces by region_code
export async function getProvinces(region_code) {
  const res = await api.get(`/provinces/${region_code}`);
  return res.data;
}

// Municipalities by province_code
export async function getMunCities(province_code) {
  const res = await api.get(`/municities/${province_code}`);
  return res.data;
}

// Barangays by muncity_code
export async function getBarangays(muncity_code) {
  const res = await api.get(`/barangays/${muncity_code}`);
  return res.data;
}

// Get amenities
export async function getAmenities(){
  const res = await api.get("/amenities");
  return res.data.amenities;
}

// Get facilities
export async function getFacilities(){
  const res = await api.get("/facilities");
  return res.data.facilities;
}

// Get Property Types
export async function getPropertyTypes(){
  const res = await api.get("/property_types");
  return res.data.types;
}

export async function getProperties(page = 1) {
  const res = await api.get(`/properties?page=${page}`);
  return res;
}

// Fetch all owner properties
export async function getOwnerProperties() {
  const res = await api.get("/owner/properties");
  return res;
}

// Create a new property
export async function createProperty(propertyData) {
  const res = await api.post("/properties", propertyData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}
// Get property by id
export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export async function getPropertyByType(type_id, property_id){
  try {
    const response = await api.get(`/properties/type/${type_id}${property_id}`);
    return response;
  } catch (error) {
    throw error
  }
}

// Update a property
export async function updateProperty(id, propertyData) {
  const res = await api.put(`/properties/${id}`, propertyData);
  return res.data;
}

// Delete a property
export async function deleteProperty(id) {
  const res = await api.delete(`/properties/${id}`);
  return res;
}

// Fetch a single property by ID
export async function getProperty(id) {
    const res = await api.get(`/properties/${id}`);
    return res.data;
}

export async function getFilteredProperties(amenities, facilities, min_price, max_price, selectedType, selectedAgreement, page) {
  const params = {
    page,
    amenities: (amenities && amenities.length) ? amenities : null,
    facilities: (facilities && facilities.length) ? facilities : null,
    min_price: min_price || null,
    max_price: max_price || null,
    selectedType: selectedType || null,
    selectedAgreement: selectedAgreement || null
  };

  return await api.get("/properties/filters", {
    params,
    // This is crucial for sending arrays to Laravel correctly
    paramsSerializer: p => qs.stringify(p, { arrayFormat: "repeat", skipNulls: true })
  });
}

export async function getFilterPropertyByType(selectedType, selectedAgreement) {
  try {
    const params = {};

    if (selectedType) {
      params.selectedType = selectedType;   // ✅ must match backend
    }

    if (selectedAgreement) {
      params.selectedAgreement = selectedAgreement;  // ✅ must match backend
    }

    const response = await api.get("/properties/filters/type", { params });
    return response.data; // ✅ return the data
  } catch (error) {
    return error;
  }
}

export async function submitBookingRequest(id) {
  try {
    console.log(id);
    const res = await api.post(`/bookings/${id}`);
    return res;
  } catch (error) {
    return error
  }
}

export async function searchProperties(query, page = 1) {
  try {
    // console.log(query, "Search Query", "page", page);
    const response = await api.get(`/property/search/${query}/page/${page}`);
    return response;
  } catch (error) {
    // console.error("Error searching properties:", error);
    return error;
  }
}

export async function getPropertyLimit(){
  try {
    const response = await api.get("/listing-limit")
    return response;
  } catch (error) {
    throw error
  }
}


export async function recordView(id){
  try {
    const response = api.post(`/record-view/${id}`);
    // console.log(response);
  } catch (error) {
    throw error
  }
}