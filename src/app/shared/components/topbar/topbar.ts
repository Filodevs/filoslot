import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private router = inject(Router);
  private authService = inject(AuthService);

  isAuthenticated = signal(this.authService.isAuthenticated());

  isAdminRoute = computed(() => this.router.url.startsWith('/admin'));

  goHome(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAuthenticated()
      ? this.router.navigate(['/admin/dashboard'])
      : this.router.navigate(['/']);
  }
}
