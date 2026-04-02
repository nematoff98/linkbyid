<script setup lang="ts">
import { computed } from 'vue'
import ProfileHeader from '~/components/public/ProfileHeader.vue'
import PublicLinksPanel from '~/components/public/PublicLinksPanel.vue'
import type { BioLink, DashboardLink, LinkDisplayMode, ProfileSettings } from '~/types/dashboard'
import type { Product } from '~/components/public/ProductCard.vue'

const props = defineProps<{ profile: ProfileSettings; mode: LinkDisplayMode; codeLinks: DashboardLink[]; bioLinks: BioLink[] }>()
const previewUsername = computed(() => props.profile.username?.trim() || 'your_username')
const publicCodeLinks = computed<Product[]>(() => props.codeLinks.map(link => ({
  id: String(link.id),
  code: link.code,
  title: link.title,
  description: link.description,
  imageUrl: link.image,
  url: link.url
})))
</script>

<template>
  <section class="rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#7ea5d5] to-[#d8a5bb] p-4 shadow-md dark:border-white/10">
    <div class="rounded-3xl border border-white/60 bg-white/60 p-4 backdrop-blur-md dark:border-white/20 dark:bg-black/20">
      <ProfileHeader :username="previewUsername" :bio="profile.bio" :avatar-url="profile.avatar" />
      <PublicLinksPanel :mode="mode" :code-links="publicCodeLinks" :bio-links="bioLinks" />
    </div>
  </section>
</template>
