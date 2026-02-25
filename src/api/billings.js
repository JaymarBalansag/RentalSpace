import api from "./api";

export async function getBillings(params) {
    try {
        const response = await api.get("billings", {params})
        return response
    } catch (error) {
        throw error
    }
}

export async function getOwnerDashboardSummary() {
    try {
        const response = await api.get("/owner/dashboard-summary");
        return response;
    } catch (error) {
        throw error;
    }
}

