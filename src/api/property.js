import api from "./api";

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
  return res.data.property_types;
}

// Fetch all properties
export async function getProperties() {
  const res = await api.get("/properties");
  return res.data;
}

// Create a new property
export async function createProperty(propertyData) {
  const res = await api.post("/properties", propertyData);
  return res.data;
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

