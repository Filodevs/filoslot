import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { CATALOG_MOCK } from '../../models/__mocks__/catalog.mock';
import { IService } from '../../models/service';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  getServices(): Observable<IService[]> {
    return of(CATALOG_MOCK).pipe(delay(500));
  }

  getMyServices(): Observable<IService[]> {
    if (this.env.isMockingEnabled()) {
      return of(CATALOG_MOCK).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.services.list);

    return this.http.get<ApiResponse<IService[]>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al obtener los servicios';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
