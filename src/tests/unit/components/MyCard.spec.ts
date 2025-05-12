import { mount } from '@vue/test-utils'
import MyCard from '@/components/aboutUs/MyCard.vue'

describe('MyCard.vue', () => {
    const propsData = {
      upper: '100',
      lower: 'Balance'
    }
  
    let wrapper: any
  
    beforeEach(() => {
      wrapper = mount(MyCard, {
        props: propsData
      })
    })
  
    it('рендерит компонент без ошибок', () => {
      expect(wrapper.exists()).toBe(true)
    })
  
    it('отображает переданный пропс upper в .bigText', () => {
      expect(wrapper.find('.bigText').text()).toBe('100')
    })
  
    it('отображает переданный пропс lower в .lowText', () => {
      expect(wrapper.find('.lowText').text()).toBe('Balance')
    })
  
    it('поддерживает число в качестве значения для upper', async () => {
      await wrapper.setProps({ upper: 250 }) 
      expect(wrapper.find('.bigText').text()).toBe('250')
    })
  
    it('поддерживает строку в качестве значения для upper', async () => {
      await wrapper.setProps({ upper: 'Test' }) 
      expect(wrapper.find('.bigText').text()).toBe('Test')
    })
  
    it('применяет основной класс card к контейнеру', () => {
      expect(wrapper.classes()).toContain('card')
    })
  
    it('имеет оба дочерних элемента с нужными классами', () => {
      expect(wrapper.find('.bigText').exists()).toBe(true)
      expect(wrapper.find('.lowText').exists()).toBe(true)
    })
  })