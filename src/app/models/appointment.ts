export interface IAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: AppointmentStatus;
  resourceId: string;
  serviceId: string;
}

export interface IAppointmentDetails {
  id: string;
  clientName: string;
  clientPhone: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: AppointmentStatus;
  business: {
    name: string;
    address: string;
  };
  service: {
    name: string;
    price: number;
    duration: number;
  };
  resource: {
    name: string;
  };
}

export enum AppointmentStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
}

export interface IBookingDataDTO {
  resourceId: string;
  serviceId: string;
  date: string;
  slotStart: string;
  customerName: string;
  customerPhone: string;
}

export interface IAppointmentResponseDTO {
  appointmentId: string;
  confirmationToken: string;
  resourceId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
}
