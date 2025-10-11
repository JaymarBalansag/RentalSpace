import api from "./api";


const first_name = null;
const last_name = null;
const role = null;
const email = null;
// For simulation purpose 
// After choosing plan 



export async function paymentConfirmation(plan, method, price){
    
    return await api.post("/paymentConfirmation", {
        plan: plan,
        payment_method: method,
        price: price
    });
}