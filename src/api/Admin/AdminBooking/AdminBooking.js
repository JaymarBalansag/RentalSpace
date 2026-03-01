import api from "@/api/api";

export async function getAdminBookings(params = {}) {
  try {
    const res = await api.get("/admin/bookings", { params });
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function getAdminBookingDetails(bookingId) {
  try {
    const res = await api.get(`/admin/bookings/${bookingId}`);
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function forceCancelAdminBooking(bookingId, reason) {
  try {
    const res = await api.patch(`/admin/bookings/${bookingId}/force-cancel`, { reason });
    return res;
  } catch (error) {
    return error.response;
  }
}

