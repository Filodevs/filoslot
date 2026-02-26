export interface IAppointment {
  id: string;
  clientName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: AppointmentStatus;
  resourceId: string;
  serviceId: string;
}

export enum AppointmentStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
}

export interface IBookingDataDTO {
  resourceId: string;
  date: Date;
  slotId: string;
  userName: string;
  phone: string;
}
