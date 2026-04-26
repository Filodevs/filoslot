import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeUrl } from '@angular/platform-browser';

import { QRCodeComponent } from 'angularx-qrcode';

import { BusinessService } from '../../../core/services/business';
import { NotificationService } from '../../../core/services/ui/notification';
import { IBusiness } from '../../../models/business';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-profile',
  imports: [QRCodeComponent, InitialsPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly _destroyed = inject(DestroyRef);
  private readonly _notifications = inject(NotificationService);
  private readonly _bisinessService = inject(BusinessService);

  business = signal<IBusiness | null>(null);
  qrDownloadLink = signal<SafeUrl>('');

  bookingUrl = computed(() => {
    const url = window.location.origin;
    return `${url}/business/${this.business()?.slug}`;
  });

  ngOnInit(): void {
    this._getBusiness();
  }

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

  private _getBusiness(): void {
    this._bisinessService
      .getMyBusiness()
      .pipe(takeUntilDestroyed(this._destroyed))
      .subscribe({
        next: (business) => {
          this.business.set(business);
        },
        error: (error) => {
          console.error('Error fetching business:', error);
        },
      });
  }
}
