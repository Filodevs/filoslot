import { IAppointment } from './appointment';

export interface IResource {
  id: string;
  name: string;
  role: string;
  serviceIds?: string[];
  appointments?: IAppointment[];
  availability?: DaySchedule[];
}

export interface CreateResourceDTO {
  name: string;
  role: string;
  serviceIds?: string[];
}

export type UpdateResourceDTO = Partial<CreateResourceDTO>;

export interface TimeRange {
  start: string;
  end: string;
}

export interface DaySchedule {
  key: string;
  label: string;
  enabled: boolean;
  ranges: TimeRange[];
}
