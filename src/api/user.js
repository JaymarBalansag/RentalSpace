import api from "./api";

export async function getUserProfile() {
  const res = await api.get("/user");
  // console.log(res)
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

export async function updateUserProfile(formData){
  try {
    const response = await api.post("/update_profile", formData, {
      headers: {
        "Content-Type" : "multipart/form-data"
      }
    })

    return response;

  } catch (error) {
    throw error
  }
}

export async function updateUserLocation(formData){
  try {
    const response = await api.post("/update-location", formData, {
      headers: {
        "Content-Type" : "multipart/form-data"
      }
    })

    return response;

  } catch (error) {
    throw error
  }
}

export async function getAuthUserId() {
  try {
    const response = await api.get("/UID");
    return response;
  } catch (error) {
    return error;
  }
}

export async function getUserPreferences() {
  const response = await api.get("/user/preferences");
  return response;
}   

export async function updateUserPreferences(amenities, property_types) {
  const response = await api.post("/user/preferences", {
    amenities,
    property_types,
  });
  return response;
}

export async function getUserPreferencesForEdit() {
  const response = await api.get("/user/preferences/edit");
  return response;
}

export async function verifyCurrentPassword(currentPassword) {
  const response = await api.post("/verify-password", {
    current_password: currentPassword,
  });
  return response;
}

export async function changeUserPassword(newPassword, confirmPassword) {
  const response = await api.post("/change-password", {
    new_password: newPassword,
    confirm_password: confirmPassword
  });
  return response;
}