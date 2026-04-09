import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppointmentService } from '../../../core/services/appointment.service';
import { ResourceService } from '../../../core/services/resource.service';
import {
  AppointmentStatus,
  IAppointmentsByResourceResponseDTO,
} from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { AppDateSelector } from '../../../shared/components/app-date-selector/app-date-selector';
import { AppSkeleton } from '../../../shared/components/app-skeleton/app-skeleton';
import { AppStatsCard } from '../../../shared/components/app-stats-card/app-stats-card';
import {
  AppointmentAction,
  ResourceAppointments,
} from './components/resource-appointments/resource-appointments';

@Component({
  selector: 'app-dashboard',
  imports: [AppDateSelector, AppSkeleton, AppStatsCard, ResourceAppointments],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly resourceService = inject(ResourceService);
  private readonly appointmentService = inject(AppointmentService);

  selectedDate = signal<Date>(new Date());
  resources = signal<IResource[]>([]);
  appointmentsByResource = signal<IAppointmentsByResourceResponseDTO[]>([]);
  loadingResources = signal(true);
  loadingAppointments = signal(true);

  stats = computed(() => {
    const all = this.resources().flatMap((r) => r.appointments);
    return {
      total: all.length,
      completed: all.filter((a) => a?.status === AppointmentStatus.completed)
        .length,
      pending: all.filter((a) => a?.status === AppointmentStatus.pending)
        .length,
    };
  });

  appointmentsByResourceMap = computed(() => {
    const map = new Map<string, IAppointmentsByResourceResponseDTO[]>();
    this.appointmentsByResource().forEach((item) =>
      map.set(item.resource.id, [...(map.get(item.resource.id) || []), item]),
    );
    return map;
  });

  ngOnInit(): void {
    this._loadAppointmentsForResource();
    this._loadResources();
  }

  onDateSelected(date: Date): void {
    if (this.loadingAppointments()) return;

    this.selectedDate.set(date);

    this._loadAppointmentsForResource();
  }

  markCompleted({ resourceId, appointmentId }: AppointmentAction): void {
    this.resources.update((list) =>
      list.map((r) =>
        r.id !== resourceId
          ? r
          : {
              ...r,
              appointments: r?.appointments?.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: AppointmentStatus.completed }
                  : a,
              ),
            },
      ),
    );
  }

  cancelAppointment({ resourceId, appointmentId }: AppointmentAction): void {
    this.resources.update((list) =>
      list.map((r) =>
        r.id !== resourceId
          ? r
          : {
              ...r,
              appointments: r?.appointments?.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: AppointmentStatus.canceled }
                  : a,
              ),
            },
      ),
    );
  }

  private _loadAppointmentsForResource(): void {
    this.loadingAppointments.set(true);

    this.appointmentService
      .getByDate(this.selectedDate())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (appointments) => {
          this.appointmentsByResource.set(appointments);
          this.loadingAppointments.set(false);
        },
        error: (error) => {
          console.error(
            `Error al cargar citas para recurso en ${this.selectedDate()}:`,
            error,
          );
          this.loadingAppointments.set(false);
        },
      });
  }

  private _loadResources(): void {
    this.loadingResources.set(true);

    this.resourceService
      .getMyResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            console.warn('No se encontraron recursos');
            this.loadingResources.set(false);
            return;
          }

          this.resources.set(data);
          this.loadingResources.set(false);
        },
        error: (error) => {
          console.error('Error al cargar recursos:', error);
          this.loadingResources.set(false);
        },
      });
  }
}
