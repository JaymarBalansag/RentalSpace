import api from "@/api/api";

export async function getActiveProperties(page) {
    try {
        const res = await api.get("/admin/properties/active", {
            params: { page },
        });
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function fetchPendingProperties(page) {
    try {
        const res = await api.get("/admin/properties/pending", {
            params: { page },
        });
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function fetchRejectedProperties(page) {
    try {
        const res = await api.get("/admin/properties/rejected", {
            params: { page },
        });
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function getPropertyDetails(id) {
    try {
        const res = await api.get(`/admin/properties/${id}`);
        return res;
    } catch (error) {
        return error.response;
    }
}


// For Actions

// Approve Property
export async function approveProperty(id){
    try {
        const res = await api.put(`/admin/properties/${id}/approve`);
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function rejectProperty(id, reason = "") {
    try {
        const res = await api.put(`/admin/properties/${id}/reject`, { reason });
        return res;
    } catch (error) {
        return error.response;
    }
}
