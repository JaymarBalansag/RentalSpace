import api from "../api";

export async function getTenantsList() {
    try {
        const response = await api.get("/tenants");
        console.log("Tenants List Response:", response);
        return response
    } catch (error) {
        return error;
    }
}

export async function getTenantsByProperty(propertyId) {
    try {
        const response = await api.get(`/tenants/property/${propertyId}`);
        return response;
    } catch (error) {
        return error;
    }
}