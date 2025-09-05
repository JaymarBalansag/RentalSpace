import api from "./api";


const first_name = null;
const last_name = null;
const role = null;
const email = null;
// For simulation purpose 
// After choosing plan 

export async function preparePayment(subscription_plan, price, payment_method){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.first_name = userInfo.first_name;
    this.last_name = userInfo.last_name;
    this.email = userInfo.email;
    this.role = userInfo.role;
}

export async function paymentConfirmation(){
    
    


    
}