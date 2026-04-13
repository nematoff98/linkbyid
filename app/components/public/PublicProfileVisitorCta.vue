<script setup lang="ts">
import { useArmedDelayedSheet } from '~/composables/useArmedDelayedSheet'
import { toRef } from 'vue'
import {TopRight} from "@element-plus/icons-vue";

const props = defineProps<{ armed: boolean }>()
const { sheetOpen, stubVisible, collapseToStub, expandFromStub } = useArmedDelayedSheet(
  toRef(props, 'armed'),
  2800,
)
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="conversion-sheet">
        <div
          v-if="sheetOpen"
          class="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="conversion-sheet-title"
        >
          <div
            class="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px] dark:bg-black/55"
            aria-hidden="true"
            @click="collapseToStub"
          />
          <aside
            class="relative z-10 mb-[max(0.5rem,env(safe-area-inset-bottom))] w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-white/15 dark:bg-neutral-900 sm:p-5"
            @click.stop
          >
            <button
              type="button"
              class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Minimize"
              @click="collapseToStub"
            >
              <span class="text-lg leading-none" aria-hidden="true">×</span>
            </button>
            <p id="conversion-sheet-title" class="pr-10 text-[15px] font-semibold text-neutral-900 dark:text-white">
              Want your own codes?
            </p>
            <p class="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              Turn your links into simple codes and share them anywhere.
            </p>
            <NuxtLink
              to="/auth"
              class="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-[0.99] dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Get your own codes
              <span aria-hidden="true" class="text-base leading-none">→</span>
            </NuxtLink>
          </aside>
        </div>
      </Transition>

      <Transition name="stub-pop">
        <button
          v-if="stubVisible"
          type="button"
          class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[110] flex max-w-[min(18rem,calc(100vw-2rem))] items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-600 py-2.5 pl-4 pr-3 text-left text-sm font-semibold text-white shadow-xl shadow-indigo-900/25 transition hover:bg-indigo-500 active:scale-[0.98] dark:border-indigo-400/30 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          aria-label="Open: get your own codes"
          @click="expandFromStub"
        >
          <span class="min-w-0 flex-1 truncate">Get your own codes</span>
          <span class="shrink-0 text-lg leading-none opacity-90" aria-hidden="true">
            <el-icon><TopRight /></el-icon>
          </span>
        </button>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.conversion-sheet-enter-active,
.conversion-sheet-leave-active {
  transition: opacity 0.28s ease;
}
.conversion-sheet-enter-active aside,
.conversion-sheet-leave-active aside {
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.conversion-sheet-enter-from,
.conversion-sheet-leave-to {
  opacity: 0;
}
.conversion-sheet-enter-from aside,
.conversion-sheet-leave-to aside {
  transform: translateY(110%);
}
.stub-pop-enter-active,
.stub-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.stub-pop-enter-from,
.stub-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
