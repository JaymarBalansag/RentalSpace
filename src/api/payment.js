import api from "./api";


const first_name = null;
const last_name = null;
const role = null;
const email = null;
// For simulation purpose 
// After choosing plan 



export function paymentConfirmation(plan, method) {
  return api.post("/payment/confirm", {
    plan,
    payment_method: method
  });
}