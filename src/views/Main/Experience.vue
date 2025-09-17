<template>
  <Header />

  <div class="container-fluid p-5 bg-light-subtle">
    <div class="row">

      <!-- Left Component -->
      <div class="col-lg-8">

        <!-- Recommended -->
        <section class="mb-5">
          <div class="d-flex align-items-center mb-3">
            <h2 class="fw-bold mb-0">Recommended</h2>
            <button class="btn btn-link ms-auto">See All</button>
          </div>
          <p class="text-muted small">Handpicked spaces based on your location and preferences.</p>

          <!-- Filters -->
          <div class="d-flex gap-2 mb-4">
            <button class="btn btn-outline-primary btn-sm rounded-pill">Near You</button>
            <button class="btn btn-outline-primary btn-sm rounded-pill">Preferences</button>
          </div>

          <!-- Horizontal scroll cards -->
          <div class="d-flex gap-3 overflow-auto pb-2">
            <div
              v-for="i in 4"
              :key="i"
              class="card shadow-sm"
              style="min-width: 250px;"
            >
              <img src="../../assets/rental.jpg" class="card-img-top" alt="Rental Property">
              <div class="card-body">
                <h6 class="card-title fw-bold">Sample Property</h6>
                <p class="card-text small text-muted">Fully furnished • Near city center</p>
                <p class="fw-bold text-primary mb-2">$250 / month</p>
                <a href="#" class="btn btn-sm btn-outline-primary">View More</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Popular Posts -->
        <section>
          <div class="d-flex align-items-center mb-3">
            <h2 class="fw-bold mb-0">Popular Posts</h2>
            <button class="btn btn-link ms-auto">See All</button>
          </div>
          <div class="list-group">
            <a
              v-for="i in 4"
              :key="i"
              href="#"
              class="list-group-item list-group-item-action d-flex gap-3 align-items-center"
            >
              <img
                src="../../assets/hotel.jpg"
                class="rounded"
                style="width: 90px; height: 70px; object-fit: cover;"
                alt="Thumbnail"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1 fw-semibold">Post Title</h6>
                <p class="mb-1 small text-muted">This is a short description of the post content.</p>
                <small class="text-secondary"><i class="bi bi-clock"></i> 3 mins ago</small>
              </div>
            </a>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <aside class="col-lg-4">

        <!-- Recent Posts -->
        <div class="card border-0 bg-white shadow-sm mb-4">
          <div class="card-header bg-white border-0">
            <h5 class="fw-bold text-center mb-0">Recent Posts</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="i in 3" :key="i" class="list-group-item d-flex align-items-center">
              <img src="../../assets/hotel.jpg" alt="thumb" class="rounded me-3" style="width:60px; height:60px; object-fit:cover;">
              <div>
                <h6 class="mb-1">Post Title</h6>
                <small class="text-muted">2 mins ago</small>
              </div>
            </li>
          </ul>
        </div>

        <!-- Trending Tags -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 text-center">
            <h5 class="fw-bold mb-0">Trending Tags</h5>
          </div>
          <div class="card-body d-flex flex-wrap gap-2">
            <span class="badge rounded-pill bg-primary">Boarding House</span>
            <span class="badge rounded-pill bg-success">Apartment</span>
            <span class="badge rounded-pill bg-warning text-dark">Near School</span>
            <span class="badge rounded-pill bg-info">Cheap Rent</span>
          </div>
        </div>

        <!-- Top Rated -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 text-center">
            <h5 class="fw-bold mb-0">Top Rated</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="i in 2" :key="i" class="list-group-item d-flex gap-3 align-items-center">
              <img src="../../assets/rental.jpg" alt="thumb" class="rounded" style="width:60px; height:60px; object-fit:cover;">
              <div class="flex-grow-1">
                <h6 class="mb-1">Cozy Apartment</h6>
                <small class="text-muted">Near University</small>
              </div>
              <span class="badge bg-success">4.9 ★</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
export default {
  name: "Experience",
  components: { Header }
}
</script>
