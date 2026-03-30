<script setup lang="ts">
import { ref, watch } from 'vue'
import ProfileForm from '~/components/dashboard/ProfileForm.vue'
import PublicProfilePreview from '~/components/dashboard/PublicProfilePreview.vue'
import { useDashboardData } from '~/composables/useDashboardData'
import type { ProfileSettings } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard' })

const { profile } = useDashboardData()
const saved = ref(false)
const draftProfile = ref<ProfileSettings>({ ...profile.value })

watch(profile, (value) => {
  draftProfile.value = { ...value }
}, { deep: true })

const saveProfile = (payload: ProfileSettings) => {
  profile.value = payload
  draftProfile.value = { ...payload }
  saved.value = true
  setTimeout(() => { saved.value = false }, 1500)
}

const updatePreview = (payload: ProfileSettings) => {
  draftProfile.value = payload
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <ProfileForm :model-value="draftProfile" @save="saveProfile" @change="updatePreview" />
      <PublicProfilePreview :profile="draftProfile" />
    </div>
    <p v-if="saved" class="mt-3 text-sm text-emerald-600">Profile saved.</p>
  </div>
</template>
