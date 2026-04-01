import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { IBusinessData, IBusinessUpdateDTO } from '../../models/businessData';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

const BUSINESS_DATA_MOCK: IBusinessData = {
  name: 'FiloSlot Barber',
  address: '123 Razor Street, Downtown',
  phone: '+1 234 567 890',
  services: [
    { name: 'Corte Premium', price: 25 },
    { name: 'Barba & Ritual', price: 15 },
    { name: 'Combo FiloSlot', price: 35 },
  ],
};

@Injectable({ providedIn: 'root' })
export class Business {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  getBusinessData(): Observable<IBusinessData> {
    return of(BUSINESS_DATA_MOCK).pipe(delay(500));
  }

  getMyBusiness(): Observable<IBusinessData> {
    if (this.env.isMockingEnabled()) {
      return of(BUSINESS_DATA_MOCK).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.business.me);

    return this.http.get<ApiResponse<IBusinessData>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al obtener el negocio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  updateBusinessData(data: IBusinessUpdateDTO): Observable<IBusinessData> {
    if (this.env.isMockingEnabled()) {
      const updatedData: IBusinessData = {
        ...BUSINESS_DATA_MOCK,
        ...data,
      };

      return of(updatedData).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.business.me);

    return this.http.patch<ApiResponse<IBusinessData>>(url, data).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al actualizar el negocio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
