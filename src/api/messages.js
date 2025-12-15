import api from "./api";


export async function fetchMessages(){
    try {
        const response = await api.get("/chats");
        // console.info("Fetched messages response: ", response);
        return response
    } catch (error) {
        return error;
    }
}

export async function fetchConversation(userId) {
    try {
        const response = await api.get(`/messages/${userId}`)
        // console.info("Fetched messages response: ", response);
        return response;
    } catch (error) {
        return error;
    }
}

export async function sendMessage(receiver_id, message){
    try {
        const response = await api.post("/messages/send", {
            receiver_id: receiver_id,
            message: message
        });
        // console.info("Send message response: ", response);
        return response;
    } catch (error) {
        return error;
    }
}

export async function initiateConversation(receiver_id, property_id){
    try {

        const response = await api.post("/messages/start", {
            receiver_id: receiver_id,
            property_id: property_id
        })

        return response;
        


    } catch (error) {
        return error;
    }
}