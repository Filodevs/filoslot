import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { IBookingDataDTO } from '../../../../../models/appointment';
import { ISlot } from '../../../../../models/slot';

@Injectable({ providedIn: 'root' })
export class Appointment {
  getAvailableSlots(resourceId: string, date: Date): Observable<ISlot[]> {
    const slots: ISlot[] = [];
    const startHour = 0;

    for (let i = 0; i < 8; i++) {
      const slotDate = new Date(date);
      slotDate.setHours(startHour + i, 0, 0, 0);

      slots.push({
        id: `${resourceId}-${slotDate.getTime()}`,
        startTime: slotDate,
        endTime: new Date(slotDate.getTime() + 60 * 60 * 1000),
        status: startHour + i !== 12 ? 'AVAILABLE' : 'BOOKED',
      });
    }

    return of(slots).pipe(delay(700));
  }

  createAppointment(
    bookingData: IBookingDataDTO,
  ): Observable<{ success: boolean; id: string }> {
    console.log('Enviando reserva al servidor...', bookingData);
    return of({
      success: true,
      id: Math.random().toString(36).substr(2, 9),
    }).pipe(delay(1200));
  }
}
