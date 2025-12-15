import api from "./api";

export async function getUserProfile() {
  const res = await api.get("/user");
  return res;
}

export async function completeProfile(formData) {
  // for (let pair of formData.entries()) {
  //   console.log(pair[0]+ ': ' + pair[1]);
  // }
  const res = await api.post("/profile_completion", formData, {
    headers: {
      "Content-Type" : "multipart/form-data"
    }
  })
  return res

}

export async function getAuthUserId() {
  try {
    const response = await api.get("/UID");
    return response;
  } catch (error) {
    return error;
  }
}