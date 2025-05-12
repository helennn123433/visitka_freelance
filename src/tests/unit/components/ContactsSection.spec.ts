import { mount } from '@vue/test-utils'
import Contacts from '@/components/Contacts.vue'
import ContactCard from '@/components/ContactCard.vue'

jest.mock('@/data/contacts', () => ({
  contacts: [
    {
      id: 1,
      icon: '/path/to/icon1.png',
      title: 'Телефон',
      subtitle: '+7 (123) 456-78-90'
    },
    {
      id: 2,
      icon: '/path/to/icon2.png',
      title: 'Email',
      subtitle: 'contact@example.com'
    }
  ]
}))

describe('Contacts.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(Contacts)
  })

  it('корректно отображает заголовок и описание', () => {
    expect(wrapper.find('.contacts__title').text()).toBe('КОНТАКТЫ')
    expect(wrapper.find('.contacts__description').text()).toContain('Наша команда работает над проектами удаленно')
  })

  it('отображает список контактов через компонент ContactCard', () => {
    const contactCards = wrapper.findAllComponents(ContactCard)
    expect(contactCards.length).toBe(2) // соответствует моковым данным

    // Проверяем, что пропсы передаются правильно
    expect(contactCards[0].props('contact')).toEqual({
      id: 1,
      icon: '/path/to/icon1.png',
      title: 'Телефон',
      subtitle: '+7 (123) 456-78-90'
    })
  })

})