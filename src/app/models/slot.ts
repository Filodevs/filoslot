export interface ISlot {
  id: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
}

export type SlotStatus = 'AVAILABLE' | 'BOOKED';
