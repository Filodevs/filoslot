import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { AppointmentStatus } from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { IService } from '../../../models/service';
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
  private readonly resourceService = inject(ResourceService);
  private readonly catalogService = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);

  selectedDate = signal<Date>(new Date());
  resources = signal<IResource[]>([]);
  services = signal<IService[]>([]);

  loadingResources = signal(true);
  loadingServices = signal(true);

  servicesByResource = computed(() => {
    const map = new Map<string, string>();
    this.services().forEach((s) => map.set(s.id, s.name));
    return map;
  });
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

  ngOnInit(): void {
    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.resources.set(data);
          this.loadingResources.set(false);
        },
      });

    this.catalogService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.services.set(data);
          this.loadingServices.set(false);
        },
      });
  }

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
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
}
