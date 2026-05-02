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
import { AppBusinessInfo } from '../../../shared/components/app-business-info/app-business-info';
import { ResourcesList } from '../../../shared/components/resources-list/resources-list';
import { ServicesList } from '../../../shared/components/services-list/services-list';
import { ProfileShare } from './components/profile-share/profile-share';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ServicesList,
    ResourcesList,
    ProfileShare,
    AppBusinessInfo,
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

  businessLoading = signal(true);
  servicesLoading = signal(true);
  resourcesLoading = signal(true);

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
          this.businessLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching business:', error);
          this.businessLoading.set(false);
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
          this.servicesLoading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
          this.servicesLoading.set(false);
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
          this.resourcesLoading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar recursos:', error);
          this.resourcesLoading.set(false);
        },
      });
  }
}
