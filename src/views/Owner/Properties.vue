<template>
  <div>
    <h4 class="mb-3">🏠 Properties</h4>
    <RouterLink to="/dashboard/properties/add" class="btn btn-primary mb-4">
      + Add Property
    </RouterLink>

    <div class="row">
      <div
        class="col-md-6 col-lg-4 mb-4"
        v-for="p in properties"
        :key="p.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ p.title }}</h5>
            <p class="card-text">
              📍 <strong>Location:</strong> {{ p.location ?? 'N/A' }}<br>
              🔖 <strong>Status:</strong>
              <span
                :class="p.is_available ? 'badge bg-success' : 'badge bg-secondary'"
              >
                {{ p.is_available ? 'Active' : 'Inactive' }}
              </span>
            </p>
            <div class="mt-auto d-flex justify-content-between">
              <RouterLink
                :to="`/dashboard/properties/${p.id}/edit`"
                class="btn btn-sm btn-warning"
              >
                Edit
              </RouterLink>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteProperty(p.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
// import api from "@/api";

export default {
  name: "Properties",
  components: { RouterLink },
  data() {
    return {
      properties: []
    };
  },
  created() {
    this.fetchProperties();
  },
  methods: {
    async fetchProperties() {
      const res = await api.get("/properties");
      this.properties = res.data;
    },
    async deleteProperty(id) {
      if (!confirm("Are you sure you want to delete this property?")) return;
      await api.delete(`/properties/${id}`);
      this.fetchProperties();
    }
  }
};
</script>

