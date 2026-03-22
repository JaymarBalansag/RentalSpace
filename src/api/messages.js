import api from "./api";


export async function fetchMessages(cursor = null, limit = 20){
    try {
        const response = await api.get("/conversations", {
            params: { cursor, limit }
        });
        return response
    } catch (error) {
        return error;
    }
}

export async function fetchConversation(userId, cursor = null, limit = 20) {
    try {
        const response = await api.get(`/messages/${userId}`, {
            params: { cursor, limit }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function fetchConversationMessages(conversationId, cursor = null, limit = 20) {
    try {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: { cursor, limit }
        });
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
        return response;
    } catch (error) {
        return error;
    }
}

export async function sendConversationMessage(conversationId, message){
    try {
        const response = await api.post(`/conversations/${conversationId}/messages`, {
            message: message
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function markConversationAsRead(conversationId) {
    try {
        const response = await api.post(`/conversations/${conversationId}/read`);
        return response;
    } catch (error) {
        return error;
    }
}

export async function initiateConversation(receiver_id, property_id){
    try {

        const response = await api.post("/conversations/start", {
            receiver_id: receiver_id,
            property_id: property_id
        })

        return response;
    } catch (error) {
        return error;
    }
}
