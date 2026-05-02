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

import { BusinessService } from '../../../core/services/business';
import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { IBusiness } from '../../../models/business';
import { IResource } from '../../../models/resource';
import { IService } from '../../../models/service';
import { ResourcesList } from '../../../shared/components/resources-list/resources-list';
import { ServicesList } from '../../../shared/components/services-list/services-list';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { ProfileShare } from './components/profile-share/profile-share';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    InitialsPipe,
    ServicesList,
    ResourcesList,
    ProfileShare,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly _destroyed = inject(DestroyRef);
  private readonly _bisinessService = inject(BusinessService);
  private readonly _catalogService = inject(CatalogService);
  private readonly resourceService = inject(ResourceService);

  business = signal<IBusiness | null>(null);
  services = signal<IService[]>([]);
  resources = signal<IResource[]>([]);

  bookingUrl = computed(() => {
    const url = window.location.origin;
    return `${url}/business/${this.business()?.slug}`;
  });

  ngOnInit(): void {
    this._getBusiness();
    this._getMyServices();
    this._getResources();
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
