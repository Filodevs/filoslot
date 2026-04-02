import { IAppointment } from './appointment';

export interface IResource {
  id: string;
  name: string;
  role: string;
  appointments?: IAppointment[];
}

export interface CreateResourceDTO {
  name: string;
  role: string;
}

export type UpdateResourceDTO = Partial<CreateResourceDTO>;
