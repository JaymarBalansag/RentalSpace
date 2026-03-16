import api from "./api";

export async function getMyBillings(){
    return await api.get("/my-billings")
}

export async function getTenantDashboard(){
    return await api.get("/tenant/dashboard");
}

export async function submitPaymentRecords(formData){
    return await api.post("/submit-payment-records", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export async function submitMockTenantPayment(payload){
  return await api.post("/tenant/mock-payments", payload);
}

export async function submitMoveOutNotice(payload){
  return await api.post("/tenant/move-out-notices", payload);
}

export async function getTenantMoveOutNotices(){
  return await api.get("/tenant/move-out-notices");
}

export async function getTenantBillingsById(tenantId){
  return await api.get(`/tenant/billings/${tenantId}`);
}
