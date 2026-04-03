import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

import { RESOURCE_MOCK } from '../../models/__mocks__/resource.mock';
import {
  CreateResourceDTO,
  DaySchedule,
  IResource,
  UpdateResourceDTO,
} from '../../models/resource';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);

  private readonly _resources = signal<IResource[]>([]);
  readonly resources = this._resources.asReadonly();

  getResources(): Observable<IResource[]> {
    return of(RESOURCE_MOCK).pipe(delay(500));
  }

  getMyResources(): Observable<IResource[]> {
    if (this.env.isMockingEnabled()) {
      return of(RESOURCE_MOCK).pipe(
        delay(500),
        tap((data) => this._resources.set(data)),
      );
    }

    const url = this.env.buildApiUrl(this.env.config().api.resources.list);

    return this.http.get<ApiResponse<IResource[]>>(url).pipe(
      map((response) => response.data),
      tap((data) => this._resources.set(data)),
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
      }).pipe(
        tap((created) => this._resources.update((list) => [...list, created])),
      );
    }

    const url = this.env.buildApiUrl(this.env.config().api.resources.create);

    return this.http.post<ApiResponse<IResource>>(url, resource).pipe(
      map((response) => response.data),
      tap((created) => this._resources.update((list) => [...list, created])),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al crear el recurso';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  update(id: string, resource: UpdateResourceDTO): Observable<IResource> {
    if (this.env.isMockingEnabled()) {
      return of({
        id,
        name: resource.name || 'Recurso Actualizado',
        role: resource.role || 'Rol Actualizado',
      }).pipe(
        tap((updated) =>
          this._resources.update((list) =>
            list.map((r) => (r.id === id ? { ...r, ...updated } : r)),
          ),
        ),
      );
    }

    const url = this.env.buildApiUrl(
      this.env.config().api.resources.update.replace(':id', id),
    );

    return this.http.patch<ApiResponse<IResource>>(url, resource).pipe(
      map((response) => response.data),
      tap((updated) =>
        this._resources.update((list) =>
          list.map((r) => (r.id === id ? { ...r, ...updated } : r)),
        ),
      ),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al actualizar el recurso';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  delete(id: string): Observable<void> {
    const url = this.env.buildApiUrl(
      this.env.config().api.resources.delete.replace(':id', id),
    );

    return this.http.delete<void>(url).pipe(
      tap(() =>
        this._resources.update((list) => list.filter((r) => r.id !== id)),
      ),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message || 'Error al eliminar el recurso';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  updateAvailability(
    resourceId: string,
    availability: DaySchedule[],
  ): Observable<IResource> {
    const url = this.env.buildApiUrl(
      this.env
        .config()
        .api.resources.updateAvailability.replace(':resourcedId', resourceId),
    );

    return this.http.put<ApiResponse<IResource>>(url, availability).pipe(
      map((response) => response.data),
      tap((updated) =>
        this._resources.update((list) =>
          list.map((r) => (r.id === resourceId ? { ...r, ...updated } : r)),
        ),
      ),
      catchError((error) => {
        const errorMessage =
          error.error?.data?.message ||
          'Error al actualizar la disponibilidad del recurso';
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
