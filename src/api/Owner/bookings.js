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
            stay_months: agreement.stay_months,
            occupant_num: agreement.occupant_num,
            lease_duration: agreement.lease_duration,
            park_needed: agreement.park_needed,
            custom_months: agreement.custom_months,
            move_in_date: agreement.move_in_date,
            room_preference: agreement.room_preference,
            notes: agreement.notes,
            agreement: agreement.agreement,
        }

        if(payload.agreement === false){
            let error = "Please check agreement"
            return error;
        }

        if(payload.stay_months === "custom"){
            payload.stay_months = payload.custom_months;
            
        }

        // console.log(payload)

        const res = await api.post("/bookings/submit_booking", payload);
        return res

    } catch (error) {
        return error
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