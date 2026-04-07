import { Component, inject, input, output } from '@angular/core';

import { NotificationService } from '../../../../../core/services/ui/notification';
import { AppButton } from '../../../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-booking-confirmation-actions',
  imports: [AppButton],
  templateUrl: './booking-confirmation-actions.html',
  styleUrl: './booking-confirmation-actions.css',
})
export class BookingConfirmationActions {
  private readonly notifications = inject(NotificationService);

  isPending = input.required<boolean>();
  isCompleted = input.required<boolean>();
  isCanceled = input.required<boolean>();
  canCancel = input.required<boolean>();

  shareWhatsAppEvent = output<void>();
  confirmCancelEvent = output<void>();
  goHomeEvent = output<void>();

  readonly isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.notifications.showSuccess('Enlace copiado al portapapeles');
    });
  }
}
