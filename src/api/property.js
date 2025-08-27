import api from "./api";

export async function isSubscribing(first_name, last_name, email) {
  const res = await api.post("/is-subscribing",{
    first_name: first_name,
    last_name: last_name,
    email: email
  });
  return res;
}