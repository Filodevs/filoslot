import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusinessService } from '../../../core/services/business';
import { IBusiness } from '../../../models/business';
import { IResource } from '../../../models/resource';
import { AppBusinessInfo } from '../../../shared/components/app-business-info/app-business-info';
import { ResourcesList } from '../../../shared/components/resources-list/resources-list';
import { ServicesList } from '../../../shared/components/services-list/services-list';
import { BookCard } from './components/book-card/book-card';

@Component({
  selector: 'app-business-profile',
  imports: [AppBusinessInfo, ServicesList, ResourcesList, BookCard],
  templateUrl: './business-profile.html',
})
export class BusinessProfile implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly businessService = inject(BusinessService);

  business = signal<IBusiness | null>(null);
  businessLoading = signal(false);

  resources = signal<IResource[]>([]);
  resourcesLoading = signal(false);

  bookingUrl = computed(() => {
    const url = window.location.origin;
    return `${url}/business/${this.business()?.slug}`;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('businessSlug');
    if (!slug) {
      console.error('No se proporcionó el slug del negocio');
      return;
    }

    this._loadBusiness(slug);
  }

  goToBooking(): void {
    const slug = this.route.snapshot.paramMap.get('businessSlug');
    this.router.navigate(['/business', slug, 'booking']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private _loadBusiness(slug: string): void {
    this.businessLoading.set(true);

    this.businessService.getBusinessBySlug(slug).subscribe({
      next: (data) => {
        if (!data) {
          console.error('Negocio no encontrado');
          this.router.navigate(['/']);
          return;
        }

        this.business.set(data);
        this.businessLoading.set(false);

        this._getResourcesByBusinessId(data.id);
      },
      error: (error) => {
        console.error(error);
        this.businessLoading.set(false);
      },
    });
  }

  private _getResourcesByBusinessId(businessId: string): void {
    this.resourcesLoading.set(true);

    this.businessService.getResourcesByBusinessId(businessId).subscribe({
      next: (resources) => {
        this.resources.set(resources);
        this.resourcesLoading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener los recursos del negocio:', error);
        this.resourcesLoading.set(false);
      },
    });
  }
}
