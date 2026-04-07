import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { NotificationService } from '../../../../../core/services/ui/notification';
import { IAppointmentDetails } from '../../../../../models/appointment';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-booking-confirmation-card',
  imports: [CommonModule, InitialsPipe],
  templateUrl: './booking-confirmation-card.html',
  styleUrl: './booking-confirmation-card.css',
})
export class BookingConfirmationCard {
  private readonly notifications = inject(NotificationService);

  appointment = input.required<IAppointmentDetails | undefined>();
  isCanceled = input.required<boolean>();
  token = input.required<string>();

  //TODO: CREAR UN SERVICIO PARA ESTA FUNCIONALIDAD
  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.notifications.showSuccess('Enlace copiado al portapapeles');
    });
  }
}
