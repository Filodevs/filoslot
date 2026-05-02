import { Component, inject, input, signal } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { QRCodeComponent } from 'angularx-qrcode';

import { NotificationService } from '../../../../../core/services/ui/notification';
import { IBusiness } from '../../../../../models/business';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-profile-share',
  imports: [QRCodeComponent, InitialsPipe],
  templateUrl: './profile-share.html',
})
export class ProfileShare {
  private readonly _notifications = inject(NotificationService);

  bookingUrl = input.required<string>();
  business = input.required<IBusiness | null>();

  qrDownloadLink = signal<SafeUrl>('');

  copyLink(): void {
    const url = this.bookingUrl();
    navigator.clipboard.writeText(url).then(() => {
      this._notifications.showSuccess('Enlace copiado al portapapeles');
    });
  }

  shareWhatsApp(): void {
    const url = this.bookingUrl();
    const businessName = this.business()?.name ?? 'nuestro negocio';

    const message =
      `💈 *${businessName}*\n\n` +
      `Reserva tu cita fácil y rápido, sin registrarte.\n\n` +
      `👉 ${url}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }
}
