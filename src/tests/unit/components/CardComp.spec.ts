import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import CardComp from '@/components/services/CardComp.vue';

describe('CardComp.vue', () => {
  const image = {
    id: 1,
    title: 'Тестовая услуга',
    price: '1000',
    image: 'test.jpg'
  };

  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(CardComp, {
      props: {
        image
      },
      global: {
        plugins: [createTestingPinia({
          stubActions: false,
          createSpy: jest.fn, 
          initialState: {
            authStore: {
              isAuthenticated: true
            }
          }
        })]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('рендерит заголовок и цену', () => {
    expect(wrapper.text()).toContain(`от ${image.price} Р/час`);
    expect(wrapper.text()).toContain(image.title);
  });

  it('рендерит картинку с правильным src', () => {
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(image.image);
  });
});
