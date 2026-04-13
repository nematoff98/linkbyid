import { onUnmounted, ref, watch, type Ref } from 'vue'

/**
 * After `armed` becomes true, opens full sheet after `delayMs`.
 * Closing the sheet shows a corner stub; stub click reopens. All reset when `armed` is false.
 */
export function useArmedDelayedSheet(armed: Ref<boolean>, delayMs: number) {
  const sheetOpen = ref(false)
  const stubVisible = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  function clearTimer() {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  watch(
    armed,
    (on) => {
      clearTimer()
      sheetOpen.value = false
      stubVisible.value = false
      if (!on) return
      timer = setTimeout(() => {
        if (armed.value) sheetOpen.value = true
      }, delayMs)
    },
    { immediate: true },
  )

  onUnmounted(clearTimer)

  function collapseToStub() {
    sheetOpen.value = false
    if (armed.value) stubVisible.value = true
  }

  function expandFromStub() {
    stubVisible.value = false
    sheetOpen.value = true
  }

  return { sheetOpen, stubVisible, collapseToStub, expandFromStub }
}
