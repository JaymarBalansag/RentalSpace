import api from "@/api/api";

export async function getUsers() {
    try {
        const res = await api.get("/admin/users");
        console.info("This is a respons from backend: ", res);
        return res;
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function getUserByStatus(status) {
    try {
        if(status === "all") {
            return await getUsers();
        } else if(status === "complete") {
            const res = await api.get(`/admin/users/completed`);
            console.log("Completed Users: ", res);
            return res;
        } else if(status === "incomplete") {
            const res = await api.get(`/admin/users/incomplete`);
            return res;
        }
    } catch (error) {
        console.error(error)
    }
}

export async function getUserDetails(userId) {
    try {
        const res = await api.get(`/admin/users/${userId}`);
        return res;
    } catch (error) {
        return error.response;
    }
}
