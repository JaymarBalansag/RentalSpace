import axios from "axios";

export async function fetchRegions() {
    const response = await axios.get("https://psgc.rootscratch.com/region")

    return response.data;
};

export async function fetchProvinces(regionCode) {
    const response = await axios.get(`https://psgc.rootscratch.com/province?id=${regionCode}`)

    return response.data;
}

export async function fetchCities(provinceCode) {
    const response = await axios.get(`https://psgc.rootscratch.com/municipal-city?id=${provinceCode}`)

    return response.data;
}

export async function fetchBarangays(cityCode) {
    const response = await axios.get(`https://psgc.rootscratch.com/barangay?id=${cityCode}`)

    return response.data;
}