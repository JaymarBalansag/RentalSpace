import api from "./api";

export async function fetchCategoryCountsHelper(){
    return await api.get('/categories/counts');
}