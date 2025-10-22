import api from "@/api/api";

export async function getOwner() {
    try {
        const res = await api.get("/admin/owner");
        return res;
    } catch (error) {
        console.error("Error fetching owner data:", error);
        return error;
    }
}