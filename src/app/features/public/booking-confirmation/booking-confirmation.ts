import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EnvironmentService } from '../../../core/services/environment.service';
import {
  AppointmentStatus,
  IAppointmentDetails,
} from '../../../models/appointment';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-booking-confirmation',
  imports: [CommonModule, InitialsPipe],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css',
})
export class BookingConfirmation {
  private readonly env = inject(EnvironmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
    console.log('Cancelar cita con token:', this.token);
  }

  private _cancelAppointment(): void {
    console.log('Cita cancelada con token:', this.token);
  }

  shareWhatsApp(): void {
    // const url = `${window.location.origin}/reserva/${this.token}`;
    // const appt = this.appointment();
    // const message =
    //   '¡Hola! Quería compartir contigo los detalles de mi reserva:\n\n';
    // window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }

  copyLink(): void {
    // const url = `${window.location.origin}/reserva/${this.token}`;
    // navigator.clipboard.writeText(url).then(() => {
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Link copiado',
    //     detail: 'El link de tu reserva fue copiado al portapapeles.',
    //     life: 2000,
    //   });
    // });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
