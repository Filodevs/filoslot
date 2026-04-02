import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { RESOURCE_MOCK } from '../../models/__mocks__/resource.mock';
import { CreateResourceDTO, IResource } from '../../models/resource';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  getResources(): Observable<IResource[]> {
    return of(RESOURCE_MOCK).pipe(delay(500));
  }

  getMyResources(): Observable<IResource[]> {
    if (this.env.isMockingEnabled()) {
      return of(RESOURCE_MOCK).pipe(delay(500));
    }

    const url = this.env.buildApiUrl(this.env.config().api.resources.list);

    return this.http.get<ApiResponse<IResource[]>>(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al obtener los recursos';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  create(resource: CreateResourceDTO): Observable<IResource> {
    if (this.env.isMockingEnabled()) {
      return of({
        id: crypto.randomUUID(),
        ...resource,
      });
    }

    const url = this.env.buildApiUrl(this.env.config().api.resources.create);

    return this.http.post<ApiResponse<IResource>>(url, resource).pipe(
      map((response) => response.data),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al crear el recurso';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
