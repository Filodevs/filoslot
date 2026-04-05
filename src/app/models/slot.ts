export interface ISlot {
  start: string;
  end: string;
  status: SlotStatus;
}

export enum SlotStatus {
  available = 'available',
  booked = 'booked',
  unavailable = 'unavailable',
}
