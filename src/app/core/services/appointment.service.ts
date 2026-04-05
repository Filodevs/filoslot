import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { generateSlotsMock } from '../../models/__mocks__/appointment.mock';
import { IBookingDataDTO } from '../../models/appointment';
import { ISlot } from '../../models/slot';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  getAvailableSlots(
    resourceId: string,
    serviceId: string,
    date: Date,
  ): Observable<ISlot[]> {
    if (this.env.isMockingEnabled()) {
      const slots = generateSlotsMock(resourceId, serviceId, date);
      return of(slots).pipe(delay(800));
    }

    const url = this.env
      .buildApiUrl(this.env.config().api.slots.available)
      .replace(':resourceId', resourceId)
      .replace(':serviceId', serviceId)
      .replace(':date', date.toISOString().split('T')[0]);

    return this.http.get<ApiResponse<ISlot[]>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message ||
          'Error al obtener los horarios disponibles';
        return throwError(() => new Error(errorMessage));
      }),
    );
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
