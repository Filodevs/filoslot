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
import { ConfirmDialog } from '../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../core/services/ui/notification';
import {
  AppointmentStatus,
  IAppointmentsByResourceResponseDTO,
} from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { AppDateSelector } from '../../../shared/components/app-date-selector/app-date-selector';
import { AppSkeleton } from '../../../shared/components/app-skeleton/app-skeleton';
import { AppStatsCard } from '../../../shared/components/app-stats-card/app-stats-card';
import { NotificationBanner } from './components/notification-banner/notification-banner';
import {
  AppointmentAction,
  ResourceAppointments,
} from './components/resource-appointments/resource-appointments';

@Component({
  selector: 'app-dashboard',
  imports: [
    AppDateSelector,
    AppSkeleton,
    AppStatsCard,
    ResourceAppointments,
    NotificationBanner,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly resourceService = inject(ResourceService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialog);

  selectedDate = signal<Date>(new Date());
  resources = signal<IResource[]>([]);
  appointmentsByResource = signal<IAppointmentsByResourceResponseDTO[]>([]);
  loadingResources = signal(true);
  loadingAppointments = signal(true);

  stats = computed(() => {
    const all = this.appointmentsByResource();
    return {
      total: all.length,
      completed: all.filter((a) => a.status === AppointmentStatus.completed)
        .length,
      pending: all.filter((a) => a.status === AppointmentStatus.pending).length,
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

  markCompleted({ appointmentId }: AppointmentAction): void {
    this.appointmentService
      .updateStatus(appointmentId, 'completed')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.appointmentsByResource.update((list) =>
            list.map((appt) =>
              appt.id === appointmentId
                ? { ...appt, status: AppointmentStatus.completed }
                : appt,
            ),
          );
          this.notificationService.showSuccess(
            'La cita ha sido marcada como completada',
            'Cita completada',
          );
        },
        error: (error) => {
          console.error('Error al completar la cita:', error);
          this.notificationService.showError(
            error.message || 'No se pudo completar la cita',
            'Error',
          );
        },
      });
  }

  async cancelAppointment({ appointmentId }: AppointmentAction): Promise<void> {
    const confirmed = await this.confirmDialog.confirm(
      '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      'Cancelar cita',
    );

    if (!confirmed) return;

    this.appointmentService
      .updateStatus(appointmentId, 'canceled')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.appointmentsByResource.update((list) =>
            list.map((appt) =>
              appt.id === appointmentId
                ? { ...appt, status: AppointmentStatus.canceled }
                : appt,
            ),
          );
          this.notificationService.showSuccess(
            'La cita ha sido cancelada',
            'Cita cancelada',
          );
        },
        error: (error) => {
          console.error('Error al cancelar la cita:', error);
          this.notificationService.showError(
            error.message || 'No se pudo cancelar la cita',
            'Error',
          );
        },
      });
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
