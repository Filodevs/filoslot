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

import { DirectoryService } from '../../../core/services/directory.service';
import { IBusinessCard } from '../../../models/businessCard';
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
  private readonly directoryService = inject(DirectoryService);

  searchQuery = signal('');
  businesses = signal<IBusinessCard[]>([]);
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
    this.directoryService
      .getBusinesses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.businesses.set(data);
        this.loading.set(false);
      });
  }

  navigateTo(id: string): void {
    this.router.navigate(['/business', id]);
  }
}
