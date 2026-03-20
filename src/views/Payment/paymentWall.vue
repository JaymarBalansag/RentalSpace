<template>
  <Header />

  <section class="payment-wall">
    <div class="container py-5">
      <div class="hero text-center mb-5">
        <span class="eyebrow">Owner Plans</span>
        <h2 class="fw-bold">Upgrade to a plan that grows with your listings</h2>
        <p class="text-muted">
          Launch your rental business with verified listings and a clean owner workspace.
        </p>
        <div class="value-row">
          <div class="value-pill"><i class="bi bi-shield-check me-2"></i>Secure payments</div>
          <div class="value-pill"><i class="bi bi-patch-check me-2"></i>Verified listings</div>
          <div class="value-pill"><i class="bi bi-headset me-2"></i>Priority support</div>
        </div>
      </div>

      <div class="row justify-content-center g-4">
      <!-- Monthly Plan -->
      <div class="col-md-5">
        <div class="plan-card plan-starter">
          <div class="plan-header">
            <div>
              <span class="plan-tag">Standard</span>
              <h4 class="plan-title">Monthly Standard</h4>
              <p class="plan-subtext">Core tools for new owners and smaller portfolios.</p>
            </div>
            <div class="plan-price">
              <span class="amount">₱200</span>
              <span class="cycle">per month</span>
            </div>
          </div>
          <ul class="plan-features">
            <li><i class="bi bi-check-circle-fill"></i> 2 property listing limit</li>
            <li><i class="bi bi-check-circle-fill"></i> Property management</li>
            <li><i class="bi bi-check-circle-fill"></i> Reviews management</li>
          </ul>
          <button @click="selectPlan('monthly')" class="btn btn-primary w-100 mt-auto">
            Choose Monthly Standard
          </button>
        </div>
      </div>

      <!-- Annual Plan -->
      <div class="col-md-5">
        <div class="plan-card plan-pro">
          <div class="plan-ribbon">Best Value</div>
          <div class="plan-header">
            <div>
              <span class="plan-tag">Pro</span>
              <h4 class="plan-title">Annual Pro</h4>
              <p class="plan-subtext">Full management suite for growing portfolios.</p>
            </div>
            <div class="plan-price">
              <span class="amount">₱1800</span>
              <span class="cycle">per year</span>
            </div>
          </div>
          <ul class="plan-features">
            <li><i class="bi bi-check-circle-fill"></i> Up to 5 property listings</li>
            <li><i class="bi bi-check-circle-fill"></i> Property management</li>
            <li><i class="bi bi-check-circle-fill"></i> Reviews management</li>
            <li><i class="bi bi-check-circle-fill"></i> Booking management</li>
            <li><i class="bi bi-check-circle-fill"></i> Tenant management</li>
            <li><i class="bi bi-check-circle-fill"></i> Billings management</li>
            <li><i class="bi bi-check-circle-fill"></i> Payment ledger Management</li>
            <li><i class="bi bi-check-circle-fill"></i> Reports & Analytics</li>
          </ul>
          <button @click="selectPlan('annual')" class="btn btn-dark w-100 mt-auto">
            Choose Annual Pro
          </button>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/components/Header.vue';
  import Swal from "sweetalert2";

export default {
  name: "PaymentWall",
  components: { Header },
  data() {
    return {}
  },
  methods: {
    selectPlan(planType) {
      const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const status = String(user?.user_verification_status || "unverified").toLowerCase().trim();
      if (status !== "verified") {
        const text = status === "pending"
          ? "Your verification is under review. Owner onboarding unlocks once approved."
          : status === "rejected"
            ? "Your verification was rejected. Please resubmit a valid government ID in your profile."
            : "You must verify your account first before applying as owner.";
        Swal.fire({
          icon: "warning",
          title: "Verification required",
          text,
          confirmButtonText: "Go to Profile",
        }).then(() => {
          this.$router.push("/profile");
        });
        return;
      }
      this.$router.push({ 
        path: '/payment/details',
        query: { plan: planType }
      })
    }
  }
}
</script>


<style scoped>
.payment-wall {
  background:
    radial-gradient(circle at top left, rgba(16, 24, 40, 0.12), transparent 50%),
    radial-gradient(circle at top right, rgba(184, 134, 11, 0.12), transparent 48%),
    linear-gradient(180deg, #f7f7fb 0%, #ffffff 100%);
}

.hero h2 {
  font-family: "Poppins", system-ui, sans-serif;
  color: #0b1020;
}

.hero .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: #1f2a44;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.value-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.value-pill {
  padding: 8px 16px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.plan-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.14);
}

.plan-pro {
  border: 1px solid rgba(184, 134, 11, 0.35);
  background: linear-gradient(180deg, #fffaf1 0%, #ffffff 100%);
}

.plan-ribbon {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
  background: #b8860b;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.plan-title {
  margin: 6px 0 4px;
  font-family: "Poppins", system-ui, sans-serif;
  color: #0b1020;
}

.plan-subtext {
  color: #64748b;
  margin: 0;
}

.plan-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
}

.plan-pro .plan-tag {
  background: rgba(184, 134, 11, 0.15);
  color: #9a6700;
}

.plan-price {
  text-align: right;
}

.plan-price .amount {
  font-size: 2rem;
  font-weight: 700;
  color: #0b1020;
}

.plan-price .cycle {
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  color: #1f2937;
  font-weight: 600;
}

.plan-features i {
  color: #1d4ed8;
  margin-right: 8px;
}

.plan-pro .plan-features i {
  color: #b8860b;
}

.btn-dark {
  background: #0b1020;
  border-color: #0b1020;
}

.btn-dark:hover {
  background: #1f2937;
  border-color: #1f2937;
}

@media (max-width: 768px) {
  .plan-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .plan-price {
    text-align: left;
  }
}
</style>
