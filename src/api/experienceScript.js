import api from "./api";

export async function getDefaultRecommendation() {
    try {
        const response = await api.get("/default");
        return response;
    } catch (error) {
        console.log("Error fetching default recommendation:", error);
        throw error;
    }
}

export async function getRecentProperties(){
    try {
        const response = await api.get("/recent");
        return response;
    } catch (error) {
        console.log("Error fetching recent properties:", error);
        throw error;
    }
}

export async function getNearProperties(){
    try {
        const response = await api.get("/nearby");
        console.log(response)
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getPrefferedAmenities(){
    try {
        const response = await api.get("/prefferedAmenities")
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getPrefferedTypes() {
    try {
        const response = await api.get("/prefferedTypes")
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getPopularTypes(){
    try {
        const response = await api.get("/popularTypes");
        return response;
    } catch (error) {
        throw error;
    }
}