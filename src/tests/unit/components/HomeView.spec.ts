import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import HomeView from '@/components/services/HomeView.vue';
import CardComp from '@/components/services/CardComp.vue';

// Моки для стора
jest.mock('@/store/searchingStore', () => ({
  useSearchingStore: jest.fn(),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Мокируем компоненты
jest.mock('@/components/services/addDialog.vue', () => ({
  __esModule: true,
  default: {
    template: '<div>AddDialogStub</div>',
  },
}));

jest.mock('@/components/ui/MyButton.vue', () => ({
  __esModule: true,
  default: {
    template: '<button><slot /></button>',
  },
}));

describe('HomeView.vue', () => {
  const mockFetchServices = jest.fn();
  const mockImages = [
    { id: '1', title: 'Image 1' },
    { id: '2', title: 'Image 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    require('@/store/searchingStore').useSearchingStore.mockReturnValue({
      images: mockImages,
      filteredImages: mockImages,
      fetchServices: mockFetchServices,
    });

    require('@/store/authStore').useAuthStore.mockReturnValue({
      isAuthenticated: true,
    });
  });

  it('загружает и отображает карточки при монтировании', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    await flushPromises();

    const cards = wrapper.findAllComponents(CardComp);
    expect(cards.length).toBe(mockImages.length);
    mockImages.forEach(img => {
      expect(wrapper.html()).toContain(img.title);
    });

    expect(mockFetchServices).toHaveBeenCalled();
  });

  it('не отображает кнопку "Добавить", если пользователь не авторизован', async () => {
    require('@/store/authStore').useAuthStore.mockReturnValueOnce({
      isAuthenticated: false,
    });

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.find('button').exists()).toBe(false);
  });
});
