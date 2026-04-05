import { ISlot, SlotStatus } from '../slot';

export const generateSlotsMock = (
  resourceId: string,
  serviceId: string,
  date: Date,
): ISlot[] => {
  const slots: ISlot[] = [];
  const startHour = 8;

  for (let i = 0; i < 8; i++) {
    const slotDate = new Date(date);
    slotDate.setHours(startHour + i, 0, 0, 0);

    slots.push({
      start:
        slotDate.getHours() +
        ':' +
        slotDate.getMinutes().toString().padStart(2, '0'),
      end:
        new Date(slotDate.getTime() + 60 * 60 * 1000).getHours() +
        ':' +
        new Date(slotDate.getTime() + 60 * 60 * 1000)
          .getMinutes()
          .toString()
          .padStart(2, '0'),
      status: startHour + i !== 12 ? SlotStatus.available : SlotStatus.booked,
    });
  }

  return slots;
};
