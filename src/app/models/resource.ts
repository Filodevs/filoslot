import { IAppointment } from './appointment';

export interface IResource {
  id: string;
  name: string;
  role: string;
  serviceIds?: string[];
  appointments?: IAppointment[];
}

export interface CreateResourceDTO {
  name: string;
  role: string;
  serviceIds?: string[];
}

export type UpdateResourceDTO = Partial<CreateResourceDTO>;
