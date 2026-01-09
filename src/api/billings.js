import api from "./api";

export async function getBillings(params) {
    try {
        const response = await api.get("billings", {params})
        return response
    } catch (error) {
        return error
    }
}

