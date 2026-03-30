<template>
  <Header />

  <div class="faq-page">
    <section class="faq-hero">
      <div class="container py-5 text-center">
        <p class="hero-eyebrow mb-2">Helpful Answers</p>
        <h1 class="display-5 fw-bold text-white mb-2">Frequently Asked Questions</h1>
        <p class="hero-copy mx-auto mb-0">
          Quick answers for renters, tenants, and owners using RentaHub.
        </p>
      </div>
    </section>

    <OwnerSubscriptionExpiredBanner />
    <SubscriptionWarningBanner />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-11">
          <RouterLink to="/home" class="back-link text-decoration-none mb-4 d-inline-flex align-items-center">
            <i class="bi bi-arrow-left me-2"></i>Back to Home
          </RouterLink>

          <section class="panel mb-4">
            <div class="row g-4 align-items-center">
              <div class="col-lg-8">
                <p class="section-eyebrow mb-2">What You Can Find Here</p>
                <h2 class="fw-bold text-dark mb-2">Answers for the most common RentaHub questions</h2>
                <p class="text-secondary mb-0">
                  We grouped the basics so users can find help faster before reaching out to support.
                </p>
              </div>
              <div class="col-lg-4">
                <div class="faq-highlight">
                  <div class="highlight-icon"><i class="bi bi-patch-question-fill"></i></div>
                  <div>
                    <h6 class="fw-bold mb-1">Still unsure?</h6>
                    <p class="small text-muted mb-0">You can always contact the team if your concern is not covered here.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            v-for="group in faqGroups"
            :key="group.id"
            class="panel mb-4"
          >
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <p class="section-eyebrow mb-2">{{ group.eyebrow }}</p>
                <h3 class="fw-bold mb-0">{{ group.title }}</h3>
              </div>
              <span class="group-count">{{ group.items.length }} questions</span>
            </div>

            <div class="accordion faq-accordion" :id="`${group.id}-accordion`">
              <div
                v-for="(item, index) in group.items"
                :key="`${group.id}-${index}`"
                class="accordion-item faq-item"
              >
                <h2 class="accordion-header" :id="`${group.id}-heading-${index}`">
                  <button
                    class="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#${group.id}-collapse-${index}`"
                    aria-expanded="false"
                    :aria-controls="`${group.id}-collapse-${index}`"
                  >
                    {{ item.question }}
                  </button>
                </h2>
                <div
                  :id="`${group.id}-collapse-${index}`"
                  class="accordion-collapse collapse"
                  :aria-labelledby="`${group.id}-heading-${index}`"
                  :data-bs-parent="`#${group.id}-accordion`"
                >
                  <div class="accordion-body text-secondary">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="cta-panel text-center">
            <h4 class="fw-bold mb-2">Need a hand with something specific?</h4>
            <p class="text-muted mb-4">
              If your question is not listed here, send us a message and we will help you out.
            </p>
            <RouterLink to="/contactus" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold">
              Contact Us
            </RouterLink>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner.vue";
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";

export default {
  name: "FaqPage",
  components: { RouterLink, Header, SubscriptionWarningBanner, OwnerSubscriptionExpiredBanner },
  data() {
    return {
      faqGroups: [
        {
          id: "getting-started",
          eyebrow: "Getting Started",
          title: "Using RentaHub",
          items: [
            {
              question: "How do I search for properties on RentaHub?",
              answer:
                "Go to Home, then filter listings by property type, agreement type, location, price, amenities, and facilities. You can also switch to the map preview to explore properties geographically.",
            },
            {
              question: "Do I need an account to browse listings?",
              answer:
                "You can browse public listings without logging in, but actions like messaging owners, bookmarking properties, reporting listings, and using account features require you to sign in.",
            },
            {
              question: "What does the map on the Home page do?",
              answer:
                "The Home map gives you a quick location preview of the current property results. You can click markers to see a small property card and jump straight to its details page.",
            },
          ],
        },
        {
          id: "booking-renting",
          eyebrow: "Booking and Renting",
          title: "For Renters and Tenants",
          items: [
            {
              question: "How do I contact a property owner?",
              answer:
                "Open a property details page and use the messaging option to start a conversation with the owner. This helps you ask about availability, rules, and other listing details before deciding.",
            },
            {
              question: "How do bookings work on RentaHub?",
              answer:
                "Bookings start from the property details flow. Depending on the current property setup, you can review the listing, send a request, and continue through the booking or checkout process available for that property.",
            },
            {
              question: "Can I save properties for later?",
              answer:
                "Yes. Logged-in renter-side users can bookmark properties and revisit them later from the Saved Properties page.",
            },
            {
              question: "How do I report a suspicious or misleading property?",
              answer:
                "On the property details page, use the report option and choose the reason that best matches your concern. Reports are reviewed by the admin team and do not automatically remove the listing.",
            },
          ],
        },
        {
          id: "owner-listings",
          eyebrow: "Owner Listings",
          title: "For Property Owners",
          items: [
            {
              question: "Why can’t I subscribe as an owner yet?",
              answer:
                "You need to verify your account and complete your profile before you can subscribe as an owner. These steps help RentaHub support safer transactions and more reliable owner records.",
            },
            {
              question: "How do I list my property on RentaHub?",
              answer:
                "Owners need an owner account with an active subscription before managing listings. Once the subscription is active, you can add properties from the owner dashboard.",
            },
            {
              question: "Why is my property not showing an image?",
              answer:
                "If no valid property image was uploaded, RentaHub shows a placeholder image instead. Uploading a proper image from the owner property editor will replace the placeholder.",
            },
            {
              question: "What happens if my owner subscription expires?",
              answer:
                "Subscription status affects owner management access. Expired or inactive subscriptions can limit listing management behavior until the subscription is renewed or updated.",
            },
          ],
        },
        {
          id: "payments-account",
          eyebrow: "Payments and Account",
          title: "Account and Payment Help",
          items: [
            {
              question: "Can I pay owner subscription fees through RentaHub?",
              answer:
                "Yes. RentaHub supports owner subscription payment flows, including checkout, renewal, and plan change flows, depending on your current subscription state.",
            },
            {
              question: "Why am I being asked to verify or complete my profile?",
              answer:
                "Some protected actions require a verified account or a completed profile so the platform can support safer transactions and more reliable user records.",
            },
            {
              question: "What should I do if something is not working?",
              answer:
                "Try refreshing the page first. If the issue continues, use the Contact Us page and include the page you were on, what you were trying to do, and any error you saw so the team can help faster.",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.faq-page {
  background: radial-gradient(circle at 20% 0, #edf4ff 0%, #f8fbff 34%, #ffffff 100%);
  min-height: 100vh;
}

.faq-hero {
  background:
    linear-gradient(145deg, rgba(20, 51, 98, 0.84), rgba(38, 90, 168, 0.78)),
    url("../../assets/Main/about.avif");
  background-size: cover;
  background-position: center;
}

.hero-eyebrow {
  color: #dce9ff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 700;
}

.hero-copy {
  color: rgba(241, 247, 255, 0.9);
  max-width: 62ch;
}

.back-link {
  color: #4a658f;
  font-weight: 600;
}

.panel {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e3ecfa;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 22px rgba(18, 43, 83, 0.06);
}

.section-eyebrow {
  color: #3a64aa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 700;
}

.faq-highlight {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  background: #f4f8ff;
  border: 1px solid #e0ebff;
  border-radius: 18px;
  padding: 1rem;
}

.highlight-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #e7f0ff;
  color: #2f61ae;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.group-count {
  background: #eef4ff;
  color: #2f61ae;
  border: 1px solid #dbe8ff;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.faq-item {
  border: 1px solid #e3ecfa;
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
  box-shadow: none;
}

.faq-item + .faq-item {
  margin-top: 0.85rem;
}

.faq-accordion .accordion-button {
  background: #ffffff;
  color: #18375f;
  box-shadow: none;
  border-radius: 16px !important;
  padding: 1rem 1.1rem;
}

.faq-accordion .accordion-button:not(.collapsed) {
  background: #edf4ff;
  color: #1d4f96;
}

.faq-accordion .accordion-body {
  line-height: 1.7;
  background: #fbfdff;
}

.cta-panel {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid #deebff;
  border-radius: 20px;
  padding: 2rem;
}

@media (max-width: 767px) {
  .panel,
  .cta-panel {
    padding: 1.2rem;
  }

  .faq-accordion .accordion-button {
    padding: 0.9rem 1rem;
    font-size: 0.97rem;
  }
}
</style>
