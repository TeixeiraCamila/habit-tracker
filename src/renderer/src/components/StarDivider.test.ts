import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StarDivider from './StarDivider.vue'

describe('StarDivider', () => {
  it('mostra o divisor decorativo', () => {
    const wrapper = mount(StarDivider)

    expect(wrapper.text()).toBe('*.☆.☽.☆.☽.☆.*')
  })
})
