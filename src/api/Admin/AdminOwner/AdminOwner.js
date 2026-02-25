import api from "@/api/api";

export async function getOwner() {
    try {
        const res = await api.get("/admin/owner");
        return res;
    } catch (error) {
        console.error("Error fetching owner data:", error);
        return error;
    }
}

export async function getOwnerDetails(ownerId) {
  return api.get(`/admin/owner/${ownerId}`);
}

export async function verifyOwner(ownerId, payload = {}) {
  return api.patch(`/admin/owner/${ownerId}/verification`, {
    verification_status: "verified",
    ...payload,
  });
}

export async function rejectOwnerVerification(ownerId, reason = "") {
  return api.patch(`/admin/owner/${ownerId}/verification`, {
    verification_status: "rejected",
    reason,
  });
}
