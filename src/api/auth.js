import api from "./api";

// Login
export async function login(email, password) {
  const res = await api.post("/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  return res.data.user;
}

// Logout
export async function logout() {
  await api.post("/logout", {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
  }); 
  localStorage.removeItem("access_token");
}

export async function register(
  first_name,
  last_name,
  email,
  password,
  password_confirmation
) {
  const res = await api.post("/register", {
    first_name,
    last_name,
    email,
    password,
    password_confirmation,
  });
  // localStorage.setItem("access_token", res.data.access_token);
  return res;
}

