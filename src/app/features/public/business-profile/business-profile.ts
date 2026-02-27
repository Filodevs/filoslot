import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IService } from '../../../models/service';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

interface IBusinessDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  photo: string;
  services: IService[];
}

@Component({
  selector: 'app-business-profile',
  imports: [InitialsPipe],
  templateUrl: './business-profile.html',
  styleUrl: './business-profile.css',
})
export class BusinessProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  business = signal<IBusinessDetail | null>(null);

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('businessUuid');

    this.business.set({
      id: uuid ?? '',
      name: 'FiloSlot Barber',
      address: '123 Razor Street, Downtown',
      phone: '+57 300 000 0000',
      rating: 4.9,
      reviewCount: 120,
      photo: '',
      services: [
        { id: 's1', name: 'Corte Premium', price: 25, duration: 30 },
        { id: 's2', name: 'Barba & Ritual', price: 15, duration: 45 },
        { id: 's3', name: 'Combo FiloSlot', price: 35, duration: 60 },
      ],
    });
  }

  goToBooking(): void {
    const uuid = this.route.snapshot.paramMap.get('businessUuid');
    this.router.navigate(['/business', uuid, 'booking']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
