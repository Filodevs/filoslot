import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private router = inject(Router);

  isAuthenticated = signal(true); // Placeholder for actual authentication logic

  isAdminRoute = computed(() => this.router.url.startsWith('/admin'));

  goHome(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAuthenticated()
      ? this.router.navigate(['/admin/dashboard'])
      : this.router.navigate(['/']);
  }
}
