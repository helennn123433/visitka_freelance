import { mount } from '@vue/test-utils'
import AboutUs from '@/components/aboutUs/AboutUs.vue'
import MyCard from '@/components/aboutUs/MyCard.vue'
import MyButton from '@/components/ui/MyButton.vue'
import { createTestingPinia } from '@pinia/testing'

describe('AboutUs.vue', () => {
    const createWrapper = (isAuthenticated = false) => {
      return mount(AboutUs, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                authStore: { 
                  user: isAuthenticated ? { login: 'admin' } : null 
                }
              },
              stubActions: false
            })
          ],
          stubs: {
            MyCard: true,
            MyButton: true
          }
        }
      })
    }
  
    it('отображает adminCard и иконку, если пользователь аутентифицирован', () => {
      const wrapper = createWrapper(true)
      const header = wrapper.find('.header')
      expect(header.find('.adminCard').exists()).toBe(true)
      expect(header.find('.adminCard img.icon').exists()).toBe(true)
    })

  it('рендерит компонент без ошибок', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает заголовок "О НАС"', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header > div').text()).toBe('О НАС')
  })

  it('отображает оба блока текста в .upperText', () => {
    const wrapper = createWrapper()
    const upperTexts = wrapper.findAll('.upperText p')
    
    expect(upperTexts.length).toBe(4)
    expect(upperTexts[0].text()).toMatch(/молодая и амбициозная команда/i)
    expect(upperTexts[1].text()).toMatch(/гордимся тем, что в нашем составе/i)
    expect(upperTexts[2].text()).toMatch(/наша команда постоянно совершенствует/i)
    expect(upperTexts[3].text()).toMatch(/мы верим, что наш опыт/i)
  })

  it('рендерит 4 компонента MyCard', () => {
    const wrapper = createWrapper()
    const cards = wrapper.findAllComponents(MyCard)
    expect(cards.length).toBe(4)
  })

  it('передаёт правильные пропсы в каждый MyCard', () => {
    const wrapper = createWrapper()
    const cards = wrapper.findAllComponents(MyCard)
    
    const expectedStats = [
      { upper: '2', lower: 'ГОДА РАБОТЫ' },
      { upper: '20', lower: 'РАЗРАБОТЧИКОВ' },
      { upper: '35', lower: 'ПРОЕКТОВ' },
      { upper: '46', lower: 'НАПРАВЛЕНИЙ' }
    ]
    
    cards.forEach((card, index) => {
      expect(card.props('upper')).toBe(expectedStats[index].upper)
      expect(card.props('lower')).toBe(expectedStats[index].lower)
    })
  })

  it('отображает кнопку MyButton с классом btn', () => {
    const wrapper = createWrapper()
    const button = wrapper.findComponent(MyButton)
    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('btn')
  })

  it('применяет основные классы к контейнеру и другим элементам', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.header').exists()).toBe(true)
    expect(wrapper.find('.middleText').exists()).toBe(true)
  })
})