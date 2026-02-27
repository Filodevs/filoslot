import { Injectable } from '@angular/core';

import { delay, Observable, of } from 'rxjs';

import { generateSlotsMock } from '../../models/__mocks__/appointment.mock';
import { IBookingDataDTO } from '../../models/appointment';
import { ISlot } from '../../models/slot';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  getAvailableSlots(resourceId: string, date: Date): Observable<ISlot[]> {
    return of(generateSlotsMock(resourceId, date)).pipe(delay(700));
  }

  createAppointment(
    bookingData: IBookingDataDTO,
  ): Observable<{ success: boolean; id: string }> {
    void bookingData;
    return of({
      success: true,
      id: Math.random().toString(36).substr(2, 9),
    }).pipe(delay(1200));
  }
}
