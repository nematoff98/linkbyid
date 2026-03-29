import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SearchInput from '~/components/public/SearchInput.vue'

describe('SearchInput', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits debounced search query', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SearchInput)

    await wrapper.get('[data-testid="search-input"]').setValue('8472')
    vi.advanceTimersByTime(450)

    const emits = wrapper.emitted('search')
    expect(emits).toBeTruthy()
    expect(emits?.[0]).toEqual(['8472'])
  })

  it('clears query and emits empty search', async () => {
    const wrapper = mount(SearchInput, {
      props: { initialQuery: 'sony' }
    })

    const clearButton = wrapper.get('button[aria-label="Clear search"]')
    await clearButton.trigger('click')

    const emits = wrapper.emitted('search')
    expect(emits?.at(-1)).toEqual([''])
  })
})
