import api from "../api";

export async function getPendingUserBookings(status = "pending") {
    try {
        const res = await api.get("/bookings/pending", { params: { status } });
        return res;
    } catch (error) {
        throw error;
    }
}

export async function submitAgreement(agreement, property_id) {
    const payload = new FormData();
    payload.append("property_id", property_id);
    if (agreement.occupant_num !== null && agreement.occupant_num !== undefined && agreement.occupant_num !== "") {
        payload.append("occupant_num", agreement.occupant_num);
    }
    if (agreement.lease_duration !== null && agreement.lease_duration !== undefined && agreement.lease_duration !== "") {
        payload.append("lease_duration", agreement.lease_duration);
    }
    if (agreement.move_in_date) {
        payload.append("move_in_date", agreement.move_in_date);
    }
    if (agreement.room_preference) {
        payload.append("room_preference", agreement.room_preference);
    }
    if (agreement.notes) {
        payload.append("notes", agreement.notes);
    }
    payload.append("agreement", agreement.agreement ? "1" : "0");

    try {
        return await api.post("/bookings/submit_booking", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        // Axios error responses are usually in error.response
        throw error.response || error;
    }
}


export async function approveBooking(booking_id){
    try {
        const response = await api.post(`/bookings/${booking_id}/approve`)
        
        return response;

    } catch (error) {
        throw error;
    }
}

export async function rejectBooking(booking_id, reason) {
    try {
        const response = await api.post(`/bookings/${booking_id}/reject`, { reason });
        return response;
    } catch (error) {
        throw error;
    }
}

// Get all payments (both pending and verified)
export const getPayments = () => api.get('/owner/payments');

// Approve a payment (marks it verified and updates billing to 'paid')
export const verifyPayment = (paymentId) => api.post(`/owner/payments/${paymentId}/verify`);

// Reject a payment (if the screenshot is fake/wrong)
export const rejectPayment = (paymentId, data) => api.post(`/owner/payments/${paymentId}/reject`, data);
