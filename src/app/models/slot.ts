export interface ISlot {
  id: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  resourceId: string;
}

export enum SlotStatus {
  available = 'available',
  booked = 'booked',
  unavailable = 'unavailable',
}
