import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { BUSINESS_MOCK } from '../../models/__mocks__/business.mock';
import { IBusiness, IBusinessUpdateDTO } from '../../models/business';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class BusinessService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  getBusiness(): Observable<IBusiness[]> {
    this.env.isMockingEnabled();

    if (this.env.isMockingEnabled()) {
      return of(BUSINESS_MOCK).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.business.list);

    return this.http.get<ApiResponse<IBusiness[]>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al obtener los negocios';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  getMyBusiness(): Observable<IBusiness> {
    if (this.env.isMockingEnabled()) {
      return of(BUSINESS_MOCK[0]).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.business.me);

    return this.http.get<ApiResponse<IBusiness>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al obtener el negocio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  updateBusiness(data: IBusinessUpdateDTO): Observable<IBusiness> {
    if (this.env.isMockingEnabled()) {
      const updatedData: IBusiness = {
        ...BUSINESS_MOCK[0],
        ...data,
      };

      return of(updatedData).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.business.me);

    return this.http.patch<ApiResponse<IBusiness>>(url, data).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al actualizar el negocio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
