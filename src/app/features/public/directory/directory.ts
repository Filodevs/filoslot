import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BusinessService } from '../../../core/services/business';
import { IBusiness } from '../../../models/business';
import { AppSkeleton } from '../../../shared/components/app-skeleton/app-skeleton';
import { BusinessCard } from './components/business-card/business-card';

@Component({
  selector: 'app-directory',
  imports: [FormsModule, AppSkeleton, BusinessCard],
  templateUrl: './directory.html',
  styleUrl: './directory.css',
})
export class Directory implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly businessService = inject(BusinessService);

  searchQuery = signal('');
  businesses = signal<IBusiness[]>([]);
  loading = signal(true);

  filteredBusinesses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.businesses();
    return this.businesses().filter(
      (b) =>
        b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this._loadBusinesses();
  }

  navigateTo(slug: string): void {
    this.router.navigate(['/business', slug]);
  }

  private _loadBusinesses(): void {
    this.loading.set(true);

    this.businessService
      .getBusiness()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.businesses.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading businesses:', error);
          this.loading.set(false);
        },
      });
  }
}
