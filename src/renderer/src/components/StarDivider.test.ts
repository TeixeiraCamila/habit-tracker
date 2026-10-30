import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StarDivider from '@renderer/components/StarDivider.vue'

describe('StarDivider', () => {
  // Monta o componente isolado e verifica apenas o texto renderizado: o
  // ornamento precisa conter "☆". Estilo e acessibilidade não são cobertos aqui.
  it('renderiza o ornamento com estrelas e luas', () => {
    const wrapper = mount(StarDivider)
    expect(wrapper.text()).toContain('☆')
  })
})
