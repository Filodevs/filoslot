export interface IAppointment {
  id: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface IBookingDataDTO {
  resourceId: string;
  date: Date;
  slotId: string;
  userName: string;
  phone: string;
}
