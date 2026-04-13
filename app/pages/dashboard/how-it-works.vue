<script setup lang="ts">
import HowItWorksArticle from '~/components/dashboard/how-it-works/HowItWorksArticle.vue'
import HowItWorksFetchPair from '~/components/dashboard/how-it-works/HowItWorksFetchPair.vue'
import HowItWorksSectionHeader from '~/components/dashboard/how-it-works/HowItWorksSectionHeader.vue'
import HowItWorksUsernameWarning from '~/components/dashboard/how-it-works/HowItWorksUsernameWarning.vue'
import {
  fetchGuide,
  linksSection,
  linksStepsPartA,
  linksStepsPartB,
} from '~/components/dashboard/how-it-works/guideLinksContent'
import {
  howItWorksIntro,
  profileSection,
  profileSteps,
  profileUsernameFirstWarning,
} from '~/components/dashboard/how-it-works/guideProfileContent'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'How it works',
})
</script>

<template>
  <div class="space-y-12 pb-8">
    <HowItWorksSectionHeader :title="howItWorksIntro.title" :description="howItWorksIntro.description" />

    <section class="space-y-8">
      <HowItWorksSectionHeader :title="profileSection.title" :description="profileSection.description" />
      <div class="flex flex-col gap-10">
        <HowItWorksUsernameWarning
          :title="profileUsernameFirstWarning.title"
          :description="profileUsernameFirstWarning.description"
        />
        <div class="flex flex-col gap-10">
          <HowItWorksArticle
            v-for="step in profileSteps"
            :key="step.id"
            :title="step.title"
            :body="step.body"
            :image-src="step.imageSrc"
            :image-alt="step.imageAlt"
          />
        </div>
      </div>
    </section>

    <section class="space-y-8">
      <HowItWorksSectionHeader :title="linksSection.title" :description="linksSection.description" />
      <div class="space-y-10">
        <HowItWorksArticle
          v-for="step in linksStepsPartA"
          :key="step.id"
          :title="step.title"
          :body="step.body"
          :image-src="step.imageSrc"
          :image-alt="step.imageAlt"
        />
        <HowItWorksFetchPair :guide="fetchGuide" />
        <HowItWorksArticle
          v-for="step in linksStepsPartB"
          :key="step.id"
          :title="step.title"
          :body="step.body"
          :image-src="step.imageSrc"
          :image-alt="step.imageAlt"
        />
      </div>
    </section>
  </div>
</template>
