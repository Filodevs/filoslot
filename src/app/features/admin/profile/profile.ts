import { CommonModule } from '@angular/common';
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
import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { NotificationService } from '../../../core/services/ui/notification';
import { IBusiness } from '../../../models/business';
import { IResource } from '../../../models/resource';
import { IService } from '../../../models/service';
import { AvatarColorPipe } from '../../../shared/pipes/avatar-color.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, QRCodeComponent, InitialsPipe, AvatarColorPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly _destroyed = inject(DestroyRef);
  private readonly _notifications = inject(NotificationService);
  private readonly _bisinessService = inject(BusinessService);
  private readonly _catalogService = inject(CatalogService);
  private readonly resourceService = inject(ResourceService);

  business = signal<IBusiness | null>(null);
  services = signal<IService[]>([]);
  resources = signal<IResource[]>([]);
  qrDownloadLink = signal<SafeUrl>('');

  bookingUrl = computed(() => {
    const url = window.location.origin;
    return `${url}/business/${this.business()?.slug}`;
  });

  ngOnInit(): void {
    this._getBusiness();
    this._getMyServices();
    this._getResources();
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

  private _getMyServices(): void {
    this._catalogService
      .getMyServices()
      .pipe(takeUntilDestroyed(this._destroyed))
      .subscribe({
        next: (data) => {
          this.services.set(data);
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
        },
      });
  }

  private _getResources(): void {
    this.resourceService
      .getMyResources()
      .pipe(takeUntilDestroyed(this._destroyed))
      .subscribe({
        next: (data) => {
          this.resources.set(data);
        },
        error: (error) => {
          console.error('Error al cargar recursos:', error);
        },
      });
  }
}
