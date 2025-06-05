import { mount } from '@vue/test-utils'
import ContactCard from '@/components/contacts/ContactCard.vue'

describe('ContactCard.vue', () => {
  const mockContact = {
    icon: '/path/to/icon.png',
    title: 'Телефон',
    subtitle: '+7 (123) 123-12-21'
  }

  it('корректно отображает переданные данные', () => {
    const wrapper = mount(ContactCard, {
      props: {
        contact: mockContact
      }
    })

    expect(wrapper.find('.contact-card__icon').attributes('src')).toBe(mockContact.icon)
    expect(wrapper.find('.contact-card__icon').attributes('alt')).toBe(mockContact.title)
    expect(wrapper.find('.contact-card__title').text()).toBe(mockContact.title)
    expect(wrapper.find('.contact-card__subtitle').text()).toBe(mockContact.subtitle)
  })

  it('содержит ссылку в заголовке', () => {
    const wrapper = mount(ContactCard, {
      props: {
        contact: mockContact
      }
    })

    const titleLink = wrapper.find('.contact-card__title a')
    expect(titleLink.exists()).toBe(true)
    expect(titleLink.attributes('href')).toBe('#')
  })
})