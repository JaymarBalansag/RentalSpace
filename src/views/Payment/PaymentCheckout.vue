<template>
  <div class="container py-5 text-center">
    <div class="card shadow p-4 mx-auto" style="max-width: 500px;">
      <h3 class="fw-bold mb-4">Complete Payment</h3>
      <p>Scan the QR Ph code below using GCash, Maya, or your Banking App.</p>
      
      <div v-if="qrCodeUrl" class="my-4">
        <img :src="qrCodeUrl" alt="QR Ph Code" class="img-fluid border p-2" />
        <p class="text-danger mt-2 small">Expires in 30 minutes</p>
      </div>

      <div v-else class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <div class="mt-4 text-start bg-light p-3 rounded">
        <h6>Order Summary:</h6>
        <div class="d-flex justify-content-between">
          <span>{{ plan }} Plan</span>
          <span class="fw-bold">₱{{ amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api';

export default {
  data() {
    return {
      qrCodeUrl: null,
      subscriptionId: null,
      plan: this.$route.query.plan,
      amount: this.$route.query.plan === 'Annual' ? 2000 : 200
    }
  },
  mounted() {
    const plan = this.$route.query.plan || "Monthly";
    this.$router.replace({
      path: "/payment/details",
      query: { plan }
    });
  },
  methods: {
    async generatePayment() {
      try {
        const response = await api.post('/paymongo/create-payment', {
          plan: this.plan,
          amount: this.amount,
        });
        this.subscriptionId = response.data.subscription_id;
        // PayMongo returns the base64 QR code in the attach step
        this.qrCodeUrl = response.data.qr_code;
        this.startPolling();
      } catch (error) {
        alert("Failed to generate QR code.");
      }
    },
    startPolling() {
        console.log("Polling started for Subscription ID:", this.subscriptionId);
        
        // Check every 3 seconds (3000 milliseconds)
        this.checkStatusInterval = setInterval(() => {
        this.checkPaymentStatus();
        }, 3000);
    },
    async checkPaymentStatus() {
        try {
            const res = await api.get(`/subscription-status/${this.subscriptionId}`);
            if (res.data.status === 'active') {
                clearInterval(this.checkStatusInterval); // Stop checking
                this.$router.push('/payment/success'); // Redirect to success page
            }
        } catch (e) {
            console.error("Status check failed");
        }
    }
  },
  beforeUnmount() {
    clearInterval(this.checkStatusInterval); // Clean up memory
  }
}
</script>
