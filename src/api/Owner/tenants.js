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

export async function moveIn(tenant_id){
    return await api.post(`/tenants/${tenant_id}/move-in`);
}

export async function getOwnerMoveOutNotices(params = {}){
    return await api.get("/owner/move-out-notices", { params });
}
