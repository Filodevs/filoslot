import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { ConfirmDialog } from '../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../core/services/ui/notification';
import {
  AppointmentStatus,
  IAppointmentDetails,
} from '../../../models/appointment';
import { AppSkeleton } from '../../../shared/components/app-skeleton/app-skeleton';
import { BookingConfirmationActions } from './components/booking-confirmation-actions/booking-confirmation-actions';
import { BookingConfirmationCard } from './components/booking-confirmation-card/booking-confirmation-card';

@Component({
  selector: 'app-booking-confirmation',
  imports: [
    CommonModule,
    BookingConfirmationCard,
    BookingConfirmationActions,
    AppSkeleton,
  ],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css',
})
export class BookingConfirmation {
  private readonly env = inject(EnvironmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmDialog = inject(ConfirmDialog);
  private readonly notifications = inject(NotificationService);
  private readonly appointmentService = inject(AppointmentService);

  readonly token = this.route.snapshot.params['token'];

  appointmentResource = httpResource<{ data: IAppointmentDetails }>(
    () =>
      `${this.env.buildApiUrl(this.env.config().api.appointments.confirmation).replace(':token', this.token)}`,
  );

  appointment = computed(() => this.appointmentResource.value()?.data);

  isPending = computed(
    () => this.appointment()?.status === AppointmentStatus.pending,
  );
  isCompleted = computed(
    () => this.appointment()?.status === AppointmentStatus.completed,
  );
  isCanceled = computed(
    () => this.appointment()?.status === AppointmentStatus.canceled,
  );
  canCancel = computed(() => this.isPending());

  statusIcon = computed(() => {
    if (this.isPending()) return '⏳';
    if (this.isCompleted()) return '✅';
    if (this.isCanceled()) return '❌';
    return '📅';
  });

  statusLabel = computed(() => {
    if (this.isPending()) return '¡Reserva agendada!';
    if (this.isCompleted()) return '¡Servicio completado!';
    if (this.isCanceled()) return 'Reserva cancelada';
    return '';
  });

  statusTitle = computed(() => {
    if (this.isPending())
      return 'Tu cita está separada. Guarda este link para consultarla o cancelarla.';
    if (this.isCompleted()) return '¡Gracias por tu visita!';
    if (this.isCanceled()) return 'Reserva cancelada';
    return '';
  });

  confirmCancel(): void {
    this.confirmDialog
      .confirm(
        '¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.',
      )
      .then((confirmed) => {
        if (confirmed) {
          this._cancelAppointment();
        }
      });
  }

  private _cancelAppointment(): void {
    this.appointmentService
      .cancel(this.token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const current = this.appointmentResource.value();

          if (current) {
            this.appointmentResource.set({
              data: {
                ...current.data,
                status: AppointmentStatus.canceled,
              },
            });
          }
        },
        error: (error) => {
          console.error('Error al cancelar la cita:', error);
          this.notifications.showError(
            'Error al cancelar la cita. Por favor, intenta nuevamente.',
          );
        },
      });
  }

  shareWhatsApp(): void {
    const url = window.location.href;
    const appt = this.appointment();
    const formatedDate = `${appt?.date ?? ''} ${appt?.startTime ?? ''}`;
    const message =
      `📅 *Reserva agendada en ${appt?.business?.name}*\n` +
      `Servicio: ${appt?.service?.name}\n` +
      `Fecha: ${formatedDate}\n\n` +
      `Guarda este link para ver o cancelar tu cita:\n` +
      `${url}`;

    // wa.me falla en localhost, api.whatsapp.com funciona en ambos
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
