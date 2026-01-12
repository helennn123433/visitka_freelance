export interface Service {
  id: string;
  title: string;
  price: number;
  image: string;
}

export interface ServicesResponse {
  services: Service[];
}

export interface UpdateFieldRequest {
  value: string;
}