<script setup lang="ts">
import DashboardLayout from '~/components/dashboard/DashboardLayout.vue'
import ProfileForm from '~/components/dashboard/ProfileForm.vue'
import type { ProfileSettings } from '~/types/dashboard'

const { profile } = useDashboardData()
const saved = ref(false)

const saveProfile = (payload: ProfileSettings) => {
  profile.value = payload
  saved.value = true
  setTimeout(() => { saved.value = false }, 1500)
}
</script>

<template>
  <DashboardLayout title="Profile Settings">
    <ProfileForm :model-value="profile" @save="saveProfile" />
    <p v-if="saved" class="mt-3 text-sm text-emerald-600">Profile saved.</p>
  </DashboardLayout>
</template>
