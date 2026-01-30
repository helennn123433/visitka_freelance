export interface Example {
  id: string;
  image: string;
  typeId: string;
  title?: string;
  description?: string;
  price?: string | number;
}

export interface ServiceTypeProject {
  id: string;
  examples: Example[];
}

export interface AddExampleRequest {
  typeId: string;
  title: string;
  description: string;
  price: number;
  image: File;
}

export interface UpdateExampleRequest {
  id: string;
  typeId: string;
  image: string;
}

export interface ServiceTypeProjectsResponse {
  servicesTypesProjects: ServiceTypeProject[];
}
