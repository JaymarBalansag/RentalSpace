<template>
  <div class="container text-center py-5">
    <h2 class="text-success fw-bold">Payment Received</h2>
    <p class="text-muted">
      We are confirming your payment. This may take a few seconds.
    </p>

    <div class="spinner-border text-primary mt-3"></div>

    <p class="small mt-3">
      Do not close this page.
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push('/home')
    }, 5000)
  }
}
</script>
