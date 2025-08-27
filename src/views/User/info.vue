<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white fw-bold">
      <h5 class="">Personal Info</h5>
    </div>
    <div class="card-body">
        <div class="row mb-3 d-flex gap-4 p-5">
          <div class="col-3 circle position-relative d-flex justify-content-center align-items-center">
            <button class="bi bi-plus-circle z-top fs-1 bg-transparent border-0 p-5"></button>
          </div>
          <div class="col">
            <h1>{{ this.form.first_name }} {{ this.form.last_name }}</h1>
            <!-- Email -->
            <div>
              <i class="bi bi-envelope fs-3"></i>
              <span v-if="form.email" class="fs-5 ms-2 fw-light">
                {{ form.email }}
              </span>
              <span v-else class="fs-5 ms-2 fw-light">
                Add Email Address
              </span>
            </div>
            <!-- Phone Number -->
            <div class="">
              <i class="bi bi-telephone fs-3"></i>
              <span v-if="form.phone_number" class="fs-5 ms-2 fw-light">
                {{ form.phone_number }}
              </span>
              <span v-else class="fs-5 ms-2 fw-light">
                Phone Number
              </span>
            </div>
          </div>
        </div>
        
    </div>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user';

export default {
  name: "info",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: ""
      }
    };
  },
    mounted() {
        this.setInfo();
    },
  methods: {
    async setInfo() {
      // Handle form submission logic here
        const res = await getUserProfile();
        this.form.first_name = res.first_name; 
        this.form.last_name = res.last_name; 
        this.form.email = res.email;  
        this.form.phone_number = res.phone_number;
    }
  }
};
</script>

<style scoped>

.circle {
  width: 20vw;
  height: 35vh;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
  background-color: grey;
}

</style>