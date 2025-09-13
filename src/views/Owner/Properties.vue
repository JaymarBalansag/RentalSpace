<template>
  <div>
    <h4 class="mb-3">🏠 Properties</h4>
    <RouterLink to="/dashboard/properties/add" class="btn btn-primary mb-3">
      + Add Property
    </RouterLink>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>Property Name</th>
          <th>Location</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in properties" :key="p.id">
          <td>{{ p.title }}</td>
          <td>{{ p.location ?? 'N/A' }}</td>
          <td>
            <span v-if="p.is_available" class="badge bg-success">Active</span>
            <span v-else class="badge bg-secondary">Inactive</span>
          </td>
          <td>
            <RouterLink
              :to="`/dashboard/properties/${p.id}/edit`"
              class="btn btn-sm btn-warning me-2"
            >
              Edit
            </RouterLink>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteProperty(p.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
