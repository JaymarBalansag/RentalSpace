import api from "../api";

export async function   getPendingUserBookings() {
    try {
        const res = await api.get("/bookings/pending");
        return res;
    } catch (error) {
        throw error;
    }
}

export async function submitAgreement(agreement, property_id) {
    // Transform "custom" months if necessary
    const stayMonths = agreement.stay_months === "custom" 
        ? agreement.custom_months 
        : agreement.stay_months;

    const payload = {
        property_id: property_id,
        stay_months: stayMonths,
        occupant_num: agreement.occupant_num,
        lease_duration: agreement.lease_duration,
        park_needed: agreement.park_needed,
        move_in_date: agreement.move_in_date,
        room_preference: agreement.room_preference,
        notes: agreement.notes,
        agreement: agreement.agreement,
    };

    try {
        return await api.post("/bookings/submit_booking", payload);
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

// Get all payments (both pending and verified)
export const getPayments = () => api.get('/owner/payments');

// Approve a payment (marks it verified and updates billing to 'paid')
export const verifyPayment = (paymentId) => api.post(`/owner/payments/${paymentId}/verify`);

// Reject a payment (if the screenshot is fake/wrong)
export const rejectPayment = (paymentId, data) => api.post(`/owner/payments/${paymentId}/reject`, data);
