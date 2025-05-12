import { mount } from '@vue/test-utils'
import Sidebar from '@/components/Sidebar.vue'
import { describe, it, expect } from '@jest/globals'

describe('Sidebar.vue', () => {
  it('корректно отображается', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает логотип', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.find('.img_n31').exists()).toBe(true)
  })

  it('отображает три основные кнопки навигации', () => {
    const wrapper = mount(Sidebar)
    const buttons = wrapper.findAll('.btn')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toMatch('О нас')
    expect(buttons[1].text()).toMatch('Услуги')
    expect(buttons[2].text()).toMatch('Контакты')
  })

  it('эмитит событие close при клике на кнопку закрытия', async () => {
    const wrapper = mount(Sidebar)
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted().close).toBeTruthy()
  })


  it('применяет класс active для активной кнопки', () => {
    const wrapper = mount(Sidebar, {
      props: { activeIcon: 'email' }
    })

    const buttons = wrapper.findAll('.btn')
    expect(buttons[2].classes()).toContain('active')
    expect(buttons[0].classes()).not.toContain('active')
  })

  it('отображает кнопку скидки', () => {
    const wrapper = mount(Sidebar)
    const discountBtn = wrapper.find('.btn_discount')
    expect(discountBtn.exists()).toBe(true)
    expect(discountBtn.text()).toContain('Получить скидку')
  })
})