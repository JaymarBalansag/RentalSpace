import api from "@/api/api";

export async function getActiveProperties(page) {
    try {
        const res = await api.get("/admin/properties/active");
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function fetchPendingProperties(page) {
    try {
        const res = await api.get("/admin/properties/pending");
        console.log("Inside service error: ", res);
        return res;
    } catch (error) {
        return error.response;
    }
}

export async function fetchRejectedProperties(page) {
    try {
        const res = await api.get("/admin/properties/rejected")
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