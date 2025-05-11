import { mount, flushPromises } from '@vue/test-utils';
import HomeView from '@/components/services/HomeView.vue';
import axios from 'axios';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HomeView.vue', () => {
  const mockImages = [
    { id: 1, title: 'Service A', price: '1000', image: 'a.jpg' },
    { id: 2, title: 'Service B', price: '2000', image: 'b.jpg' }
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: { services: mockImages }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('загружает и отображает карточки при монтировании', async () => {
    const wrapper = mount(HomeView);
    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'CardComp' });
    expect(cards.length).toBe(mockImages.length);

    mockImages.forEach((img) => {
      expect(wrapper.html()).toContain(img.title);
      expect(wrapper.html()).toContain(`от ${img.price} Р/час`);
    });
  });

  it('отображает сообщение об ошибке при неудачном запросе', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(HomeView);
    await flushPromises();

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
