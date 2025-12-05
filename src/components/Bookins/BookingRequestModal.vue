<template>
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Tenant Agreement title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="booking-fields">

            <!-- Duration -->
            <label class="form-label fw-bold">How long do you plan to stay?</label>

            <div class="d-flex flex-column gap-1">
                <label><input type="radio" v-model="stay_months" :value="1" /> 1 month</label>
                <label><input type="radio" v-model="stay_months" :value="3" /> 3 months</label>
                <label><input type="radio" v-model="stay_months" :value="6" /> 6 months</label>
                <label><input type="radio" v-model="stay_months" :value="12" /> 1 year</label>

                <!-- Custom -->
                <label class="d-flex align-items-center gap-2">
                <input type="radio" v-model="stay_months" value="custom" />
                Custom:
                <input
                    v-if="stay_months === 'custom'"
                    type="number"
                    min="1"
                    class="form-control form-control-sm"
                    v-model="custom_months"
                    placeholder="Enter months"
                    style="width: 120px"
                />
                </label>
            </div>

            <!-- Move-in Date -->
            <label class="form-label fw-bold mt-3">Move-in Date:</label>
            <input
                type="date"
                class="form-control"
                v-model="move_in_date"
            />

            <!-- Notes -->
            <label class="form-label fw-bold mt-3">Additional Notes:</label>
            <textarea
                class="form-control"
                rows="3"
                v-model="notes"
                placeholder="Any special requests or information?"
            ></textarea>

            <!-- Agreement -->
            <div class="form-check mt-3">
                <input
                type="checkbox"
                class="form-check-input"
                v-model="agreement"
                id="agreeRules"
                />
                <label class="form-check-label" for="agreeRules">
                I agree to the house rules and terms set by the owner.
                </label>
            </div>

            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Submit</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>

export default {
    name: "BookingRequestModal",
    data() {
    return {
        
    };
    },
    methods: {
    confirmBooking() {
        if (!this.agreement) {
        alert("You must agree to the house rules.");
        return;
        }

        const finalMonths =
        this.stay_months === "custom"
            ? this.custom_months
            : this.stay_months;

        if (!finalMonths) {
        alert("Please select how long you plan to stay.");
        return;
        }

        if (!this.move_in_date) {
        alert("Please choose your move-in date.");
        return;
        }

        // Send to your backend
        this.$emit("submit-booking-details", {
        stay_months: finalMonths,
        move_in_date: this.move_in_date,
        notes: this.notes,
        });
    },
}
}

</script>