export interface Example {
  id: string;
  image: string;
  typeId: string;
}

export interface ServiceTypeProject {
  id: string;
  examples: Example[];
}

export interface AddExampleRequest {
  typeId: string;
  image: string;
}

export interface UpdateExampleRequest {
  id: string;
  typeId: string;
  image: string;
}

export interface ServiceTypeProjectsResponse {
  servicesTypesProjects: ServiceTypeProject[];
}
