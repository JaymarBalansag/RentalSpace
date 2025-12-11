<template>
  <div>
    <h4 class="mb-3"><span class="bi bi-book"></span> Bookings</h4>
    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex gap-2">
        <input type="text" class="form-control" placeholder="Search Tenant..." v-model="searchQuery" />
        <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
    </div>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Property</th>
          <th>Booking Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id" class="table-row-hover">
          <td>{{ booking.first_name }} {{ booking.last_name }}</td>
          <td>{{ booking.title }}</td>
          <td>
            
            <span class="text-dark rounded-pill text-center bg-warning p-1">{{ booking.status }}</span>
          </td>
          <td class="d-flex gap-2">
            <button class="btn btn-primary"><span class="bi bi-eye"></span></button>
            <button class="btn btn-danger"><span class="bi bi-trash"></span></button>
            <button class="btn btn-primary"><span class="bi bi-chat"></span></button>

            <!-- Button trigger modal -->
            <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="'#' + booking.id">
              <span class="bi bi-check"></span>
            </button>

            <!-- Modal -->
            <div class="modal fade" :id="booking.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{booking.first_name + " " + booking.last_name}}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <!-- Boarding House -->
                      <div v-if="booking.type_name === 'Boarding House'">
                        <label>How long do you plan to stay?</label>
                        <select v-model="booking.stay_duration" class="form-select">
                          <option value="1">1 month</option>
                          <option value="3">3 months</option>
                          <option value="6">6 months</option>
                          <option value="12">1 year</option>
                          <option value="custom">Custom</option>
                        </select>
                        <div v-if="booking.stay_duration === 'custom'" class="mt-2">
                          <input type="number" v-model="booking.custom_months" min="1" class="form-control" placeholder="Enter months" />
                        </div>

                        <label class="mt-2">Move-in Date:</label>
                        <input type="date" v-model="booking.move_in_date" class="form-control" />

                        <label class="mt-2">Additional Notes:</label>
                        <textarea v-model="booking.notes" class="form-control"></textarea>

                        <div class="form-check mt-2">
                          <input type="checkbox" v-model="booking.agreement" class="form-check-input" id="boardingAgree">
                          <label class="form-check-label" for="boardingAgree">
                            I agree to the house rules and terms set by the owner.
                          </label>
                        </div>
                      </div>

                      <!-- Apartment / Condo / House -->
                      <div v-else-if="['Apartment', 'Condo', 'House'].includes(booking.type_name)">
                        <label>Lease Duration (months):</label>
                        <input type="number" v-model="booking.lease_duration" min="1" class="form-control" />

                        <label class="mt-2">Move-in Date:</label>
                        <input type="date" v-model="booking.move_in_date" class="form-control" />

                        <label class="mt-2">Number of Occupants:</label>
                        <input type="number" v-model="booking.occupants_num" min="1" class="form-control" />

                        <label class="mt-2">Room Preference (optional):</label>
                        <input type="text" v-model="booking.room_preference" class="form-control" placeholder="e.g., near window, upper floor" />

                        <label class="mt-2">Additional Notes:</label>
                        <textarea v-model="booking.notes" class="form-control"></textarea>

                        <div class="form-check mt-2">
                          <input type="checkbox" v-model="booking.agreement" class="form-check-input" id="residentialAgree">
                          <label class="form-check-label" for="residentialAgree">
                            I agree to the terms and rules set by the owner.
                          </label>
                        </div>
                      </div>

                      <!-- Commercial Space -->
                      <div v-else-if="booking.type_name === 'Commercial Space'">
                        <label>Lease Duration (months):</label>
                        <input type="number" v-model="booking.lease_duration" min="1" class="form-control" />

                        <label class="mt-2">Move-in Date:</label>
                        <input type="date" v-model="booking.move_in_date" class="form-control" />

                        <label class="mt-2">Area Needed (sqm):</label>
                        <input type="number" v-model="booking.occupants_num" min="1" class="form-control" />

                        <label class="mt-2">Additional Notes:</label>
                        <textarea v-model="booking.notes" class="form-control"></textarea>

                        <div class="form-check mt-2">
                          <input type="checkbox" v-model="booking.agreement" class="form-check-input" id="commercialAgree">
                          <label class="form-check-label" for="commercialAgree">
                            I agree to the commercial space terms and conditions.
                          </label>
                        </div>
                      </div>

                      <!-- Fallback for unknown type -->
                      <div v-else>
                        <p>Unknown rental type. Please contact support.</p>
                      </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="approveBooking(booking)">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          </td>




          
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>

import {approveBooking, getPendingUserBookings} from '@/api/Owner/bookings';

export default {
  data() {
    return {
      selectedBooking: null,
      bookings: [],
      searchQuery: '',
    };
  },
  computed: {
    filteredTenants() {
      return this.tenants.filter(tenant => tenant.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
    },

    // Get PEnding Bookings
    async fetchPendingBookings() {
      try {
        const response = await getPendingUserBookings();
        this.bookings = response.data.data.map(b => ({
          ...b,
          agreement: b.agreement == 1 ? true : false,  // convert number → boolean
        }));
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    },

    async approveBooking(bookings){
      try {

        if(!bookings.agreement){
          alert("you must agree to the terms and conditions before approving the booking.");
          return;
        }

        // alert(bookings.agreement)
        const response = await approveBooking(bookings.id);
        if(response.status === 200){
          alert("Booking approved successfully!");

          this.fetchPendingBookings();
        } else {
          alert("Failed to approve booking.");
        }
      } catch (error) {
        alert(error);
      }
    }


  },
  mounted() {
    this.fetchPendingBookings();
  }
};
</script>

<style scoped>
.table-row-hover:hover {
  background-color: #f1f1f1;
}

.table th, .table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.875rem;
}

.btn-outline-secondary {
  font-size: 0.9rem;
}
</style>
