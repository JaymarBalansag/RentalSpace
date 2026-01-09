import api from "../api";

export async function   getPendingUserBookings() {
    try {
        const res = await api.get("/bookings/pending");
        console.log(res)
        return res;
    } catch (error) {
        return error
    }
}

export async function submitAgreement(agreement, property_id) {
    try {
        let payload = {
            property_id: property_id,
            stay_months: agreement.stay_months === "custom" ? agreement.custom_months : agreement.stay_months,
            occupant_num: agreement.occupant_num,
            lease_duration: agreement.lease_duration,
            park_needed: agreement.park_needed,
            move_in_date: agreement.move_in_date,
            room_preference: agreement.room_preference,
            notes: agreement.notes,
            agreement: agreement.agreement,
        }

        if (!payload.agreement) {
            // Throw an error format that matches Axios so your catch block works
            throw { response: { status: 422, data: { error: "Please check agreement" } } };
        }

        return await api.post("/bookings/submit_booking", payload);
    } catch (error) {
        // IMPORTANT: Re-throw or return the specific response so the component can read status
        throw error.response || error;
    }
}

export async function approveBooking(booking_id){
    try {
        console.log(booking_id)
        const response = await api.post(`/bookings/${booking_id}/approve`)
        
        return response;

    } catch (error) {
        return error;
    }
}

// Get all payments (both pending and verified)
export const getPayments = () => api.get('/owner/payments');

// Approve a payment (marks it verified and updates billing to 'paid')
export const verifyPayment = (paymentId) => api.post(`/owner/payments/${paymentId}/verify`);

// Reject a payment (if the screenshot is fake/wrong)
export const rejectPayment = (paymentId, data) => api.post(`/owner/payments/${paymentId}/reject`, data);