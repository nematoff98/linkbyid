import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductCard from '~/components/public/ProductCard.vue'

describe('ProductCard', () => {
  it('renders product details and code badge', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          id: '1',
          code: '8472',
          title: 'Sony WH-1000XM5',
          description: 'Noise canceling headphones',
          imageUrl: 'https://example.com/headphone.jpg',
          url: 'https://example.com/product'
        }
      }
    })

    expect(wrapper.text()).toContain('Sony WH-1000XM5')
    expect(wrapper.text()).toContain('8472')
    expect(wrapper.get('[data-testid="product-card"]').attributes('href')).toBe('https://example.com/product')
  })

  it('falls back to placeholder image on error', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          id: '2',
          code: '1942',
          title: 'Watch',
          imageUrl: 'https://example.com/broken-image.jpg',
          url: 'https://example.com/watch'
        }
      }
    })

    const image = wrapper.get('img')
    await image.trigger('error')

    expect(image.attributes('src')).toContain('data:image/svg+xml')
  })
})
