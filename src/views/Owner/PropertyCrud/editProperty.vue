<template>
  <div>
    <h4 class="mb-3">✏️ Edit Property</h4>
    <form @submit.prevent="updateProperty">
      <div class="mb-3">
        <label class="form-label">Title *</label>
        <input type="text" v-model="form.title" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Price *</label>
        <input type="number" v-model="form.price" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Agreement Type *</label>
        <select v-model="form.agreement_type" class="form-select" required>
          <option value="rental">Rental</option>
          <option value="lease">Lease</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Payment Frequency *</label>
        <select v-model="form.payment_frequency" class="form-select" required>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Property Type *</label>
        <select v-model="form.property_type_id" class="form-select" required>
          <option disabled value="">-- Select Type --</option>
          <option v-for="type in propertyTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">
        Update Property
      </button>
    </form>
  </div>
</template>

<script>
// import api from "@/api";

export default {
  data() {
    return {
      form: {
        title: "",
        price: "",
        agreement_type: "",
        payment_frequency: "monthly",
        property_type_id: ""
      },
      propertyTypes: [
        { id: 1, name: "Boarding House" },
        { id: 2, name: "Apartment" },
        { id: 3, name: "Condo" }
      ]
    };
  },
  async created() {
    const id = this.$route.params.id;
    const res = await api.get(`/properties/${id}`);
    this.form = res.data;
  },
  methods: {
    async updateProperty() {
      const id = this.$route.params.id;
      await api.put(`/properties/${id}`, this.form);
      this.$router.push("/dashboard/properties");
    }
  }
};
</script>
