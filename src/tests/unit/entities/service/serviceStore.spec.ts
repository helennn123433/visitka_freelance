import { setActivePinia, createPinia } from 'pinia';
import { useServiceStore } from '@entities/service';
import { servicesApi } from '@entities/service/api/servicesApi';
import type { Service } from '@entities/service/model/types';

jest.mock('@entities/service/api/servicesApi');

describe('serviceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  const mockServices: Service[] = [
    { id: '1', title: 'Service 1', price: 100, image: 'image1.jpg' },
    { id: '2', title: 'Service 2', price: 200, image: 'image2.jpg' },
  ];

  describe('fetchServices', () => {
    it('успешно загружает услуги', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);

      const store = useServiceStore();
      await store.fetchServices();

      expect(store.services).toEqual(mockServices);
      expect(servicesApi.getServices).toHaveBeenCalledTimes(1);
    });

    it('устанавливает ошибку при неудачной загрузке', async () => {
      const errorMessage = 'Network error';
      (servicesApi.getServices as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const store = useServiceStore();
      await expect(store.fetchServices()).rejects.toThrow();

      expect(store.error).toBeTruthy();
    });
  });

  describe('getServiceById', () => {
    it('возвращает услугу по ID', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);

      const store = useServiceStore();
      await store.fetchServices();

      const service = store.getServiceById('1');
      expect(service).toEqual(mockServices[0]);
    });

    it('возвращает undefined для несуществующего ID', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);

      const store = useServiceStore();
      await store.fetchServices();

      const service = store.getServiceById('999');
      expect(service).toBeUndefined();
    });
  });

  describe('addService', () => {
    it('добавляет новую услугу', async () => {
      const newService: Service = { id: '3', title: 'Service 3', price: 300, image: 'image3.jpg' };
      (servicesApi.createService as jest.Mock).mockResolvedValue(newService);

      const store = useServiceStore();
      await store.addService({ title: 'Service 3', price: 300, image: 'image3.jpg' });

      expect(store.services).toContainEqual(newService);
      expect(servicesApi.createService).toHaveBeenCalledWith({
        title: 'Service 3',
        price: 300,
        image: 'image3.jpg',
      });
    });
  });

  describe('updateService', () => {
    it('обновляет существующую услугу', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);
      const updatedService = { ...mockServices[0], title: 'Updated Service' };
      (servicesApi.updateService as jest.Mock).mockResolvedValue(updatedService);

      const store = useServiceStore();
      await store.fetchServices();
      await store.updateService('1', { title: 'Updated Service' });

      expect(store.services[0].title).toBe('Updated Service');
    });

    it('выбрасывает ошибку для несуществующей услуги', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);

      const store = useServiceStore();
      await store.fetchServices();

      await expect(store.updateService('999', { title: 'Test' })).rejects.toThrow();
    });
  });

  describe('deleteService', () => {
    it('удаляет услугу', async () => {
      (servicesApi.getServices as jest.Mock).mockResolvedValue(mockServices);
      (servicesApi.deleteService as jest.Mock).mockResolvedValue(undefined);

      const store = useServiceStore();
      await store.fetchServices();
      await store.deleteService('1');

      expect(store.services).not.toContainEqual(mockServices[0]);
      expect(store.services.length).toBe(1);
    });
  });
});
