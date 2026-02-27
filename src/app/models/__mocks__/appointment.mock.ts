import { ISlot, SlotStatus } from '../slot';

export const generateSlotsMock = (resourceId: string, date: Date): ISlot[] => {
  const slots: ISlot[] = [];
  const startHour = 8;

  for (let i = 0; i < 8; i++) {
    const slotDate = new Date(date);
    slotDate.setHours(startHour + i, 0, 0, 0);

    slots.push({
      id: `${resourceId}-${slotDate.getTime()}`,
      startTime: slotDate,
      endTime: new Date(slotDate.getTime() + 60 * 60 * 1000),
      status: startHour + i !== 12 ? SlotStatus.available : SlotStatus.booked,
      resourceId,
    });
  }

  return slots;
};
