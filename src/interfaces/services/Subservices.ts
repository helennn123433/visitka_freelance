export interface SubserviceType {
  id?: string;
  title: string;
  image: string;
  serviceId: string;
}

export interface Subservice {
  subserviceId: string;
  types: SubserviceType[];
}

export interface SubservicesResponse {
  subservices: Subservice[];
}

export interface DeleteTypeRequest {
  value: string;
}

export interface UpdateTypeRequest {
  id: string;
  title: string;
  image: string;
  serviceId: string;
}

export interface UpdateFieldRequest {
  value: string;
}