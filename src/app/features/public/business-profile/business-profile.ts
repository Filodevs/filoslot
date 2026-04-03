import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusinessService } from '../../../core/services/business';
import { IBusiness } from '../../../models/business';
import { AppButton } from '../../../shared/components/app-button/app-button';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-business-profile',
  imports: [InitialsPipe, AppButton],
  templateUrl: './business-profile.html',
  styleUrl: './business-profile.css',
})
export class BusinessProfile implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly businessService = inject(BusinessService);

  business = signal<IBusiness | null>(null);

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
    this.businessService.getBusinessBySlug(slug).subscribe({
      next: (data) => {
        this.business.set(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
