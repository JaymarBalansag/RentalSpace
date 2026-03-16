import api from "../api";

export async function getLedgerPayments(params = {}) {
  return await api.get("/owner/ledger/payments", { params });
}

export async function createLedgerPayment(payload) {
  return await api.post("/owner/ledger/payments", payload);
}

export async function getLedgerTenants(params = {}) {
  return await api.get("/owner/ledger/tenants", { params });
}

export async function getLedgerDues(params = {}) {
  return await api.get("/owner/ledger/dues", { params });
}
