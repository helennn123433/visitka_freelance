export interface Example {
  id: number;
  image: string;
}

export interface ServiceType {
  id: number;
  title: string;
  image: string;
  examples?: Example[];
}

export interface Service {
  id: number;
  types: ServiceType[];
}