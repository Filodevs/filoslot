import { Component, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

export interface IBusinessCard {
  id: string;
  slug: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  photo: string;
  featuredServices: string[];
}

@Component({
  selector: 'app-directory',
  imports: [FormsModule, InitialsPipe],
  templateUrl: './directory.html',
  styleUrl: './directory.css',
})
export class Directory {
  private router = inject(Router);

  searchQuery = signal('');

  businesses = signal<IBusinessCard[]>([
    {
      id: '1',
      slug: 'filoslot-barber',
      name: 'FiloSlot Barber',
      address: '123 Razor Street, Downtown',
      rating: 4.9,
      reviewCount: 120,
      photo: '',
      featuredServices: ['Corte Premium', 'Barba & Ritual', 'Combo FiloSlot'],
    },
    {
      id: '2',
      slug: 'estudio-corte-fino',
      name: 'Estudio Corte Fino',
      address: 'Av. Principal 45, Centro',
      rating: 4.7,
      reviewCount: 85,
      photo: '',
      featuredServices: ['Corte Clásico', 'Degradado', 'Afeitado'],
    },
    {
      id: '3',
      slug: 'barber-kings',
      name: 'Barber Kings',
      address: 'Calle 80 #12-34, Norte',
      rating: 4.5,
      reviewCount: 60,
      photo: '',
      featuredServices: ['Corte + Barba', 'Diseño de cejas'],
    },
  ]);

  filteredBusinesses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.businesses();
    return this.businesses().filter(
      (b) =>
        b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q),
    );
  });

  navigateTo(uuid: string): void {
    this.router.navigate(['/business', uuid]);
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  isStarFilled(index: number, rating: number): boolean {
    return index < Math.round(rating);
  }
}
