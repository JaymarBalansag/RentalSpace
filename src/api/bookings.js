import api from "./api";

export async function getMyBookings(status = "all") {
  try {
    const res = await api.get("/bookings/my", { params: { status } });
    return res;
  } catch (error) {
    throw error;
  }
}
