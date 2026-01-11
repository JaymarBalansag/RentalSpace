<template>
  <div class="container text-center py-5">
    <h2 class="text-danger fw-bold">Payment Failed</h2>
    <p class="text-muted">
      The payment was not completed.
    </p>

    <button
      class="btn btn-primary mt-3"
      @click="$router.push('/payment/wall')"
    >
      Try Again
    </button>
  </div>
</template>
