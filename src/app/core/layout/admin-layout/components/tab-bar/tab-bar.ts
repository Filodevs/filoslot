import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';

interface TabItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-tab-bar',
  imports: [RouterLink],
  templateUrl: './tab-bar.html',
  styleUrl: './tab-bar.css',
})
export class TabBar {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly tabs: TabItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/admin/dashboard' },
    { label: 'Setup', icon: 'pi-cog', route: '/admin/setup' },
    { label: 'Perfil', icon: 'pi-building', route: '/admin/profile' },
  ];

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
