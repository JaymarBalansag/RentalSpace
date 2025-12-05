import api from "./api";

export async function sendMessage(receiverId, message) {
    try {
        const res = await api.post("/messages", {
            receiver_id: receiverId,
            message: message
        });
        console.info("Message sent response: ", res);
        return res;
    } catch (error) {
        console.error(error)
    }
}

