import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { generateSlotsMock } from '../../models/__mocks__/appointment.mock';
import {
  AppointmentStatus,
  IAppointmentResponseDTO,
  IBookingDataDTO,
} from '../../models/appointment';
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
  ): Observable<IAppointmentResponseDTO> {
    if (this.env.isMockingEnabled()) {
      const mockResponse: ApiResponse<IAppointmentResponseDTO> = {
        data: {
          appointmentId: 'mock-appointment-id',
          confirmationToken: 'mock-confirmation-token',
          resourceId: bookingData.resourceId,
          serviceId: bookingData.serviceId,
          startTime: new Date(`${bookingData.date}T${bookingData.slotStart}`),
          endTime: new Date(`${bookingData.date}T${bookingData.slotStart}`),
          status: AppointmentStatus.pending,
        },
      };
      return of(mockResponse.data).pipe(delay(1000));
    }

    const url = this.env.buildApiUrl(this.env.config().api.appointments.create);

    return this.http
      .post<ApiResponse<IAppointmentResponseDTO>>(url, bookingData)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          const errorMessage =
            error.error?.data?.message || 'Error al crear la cita';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }
}
