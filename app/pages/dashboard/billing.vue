<script setup lang="ts">
import BillingPlanCard from '~/components/dashboard/BillingPlanCard.vue'
import PaymentHistoryTable from '~/components/dashboard/PaymentHistoryTable.vue'
import PricingCard from '~/components/dashboard/PricingCard.vue'

definePageMeta({ layout: 'dashboard' })

const { subscription, payments, actionLoading, actionLabel, openStripe, openBillingPortal, cancelSubscription } = useBillingData()

const freeFeatures = ['Up to 5 links', 'Basic profile page', 'Community support']
const proFeatures = ['Unlimited links', 'Analytics', 'Custom theme', 'Priority loading']

const handleAction = () => {
  if (subscription.value.plan === 'free') openStripe('pro')
  else openBillingPortal()
}
</script>

<template>
  <div>
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <BillingPlanCard
        :subscription="subscription"
        :loading="actionLoading"
        :action-label="actionLabel"
        @action="handleAction"
        @cancel="cancelSubscription"
      />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PricingCard title="Free" price="$0/month" description="Great for getting started." :features="freeFeatures" />
        <PricingCard title="Pro" price="$5/month" description="Ideal for creators who scale." :features="proFeatures" featured />
      </div>
    </section>

    <section class="mt-6">
      <PaymentHistoryTable :payments="payments" />
    </section>
  </div>
</template>
