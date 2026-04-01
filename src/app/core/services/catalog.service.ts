import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { CATALOG_MOCK } from '../../models/__mocks__/catalog.mock';
import {
  CreateServiceDTO,
  IService,
  UpdateServiceDTO,
} from '../../models/service';
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

  create(service: CreateServiceDTO): Observable<IService> {
    if (this.env.isMockingEnabled()) {
      return of({
        id: crypto.randomUUID(),
        ...service,
      });
    }

    const url = this.env.buildApiUrl(this.env.config().api.services.create);

    return this.http.post<ApiResponse<IService>>(url, service).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al crear el servicio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  update(id: string, service: UpdateServiceDTO): Observable<IService> {
    const url = this.env.buildApiUrl(
      this.env.config().api.services.update.replace(':id', id),
    );

    return this.http.patch<ApiResponse<IService>>(url, service).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al actualizar el servicio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  delete(id: string): Observable<void> {
    const url = this.env.buildApiUrl(
      this.env.config().api.services.delete.replace(':id', id),
    );

    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al eliminar el servicio';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
