import api from "../api";

export async function fetchPropertyData(id){
    try {
        const response = api.get(`/properties/edit/id/${id}`)
        return response
    } catch (error) {
        throw error
    }
}

export async function updatePropertyData(id, propertyData){
    try {
        const response = api.post(`/properties/update/id/${id}`, propertyData, {
            headers: {
            "Content-Type": "multipart/form-data"
            }
        });
        return response
    } catch (error) {
        throw error
    }
}
