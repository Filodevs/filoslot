import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css',
})
export class SidebarNav {
  private router = inject(Router);

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  logout(): void {
    console.log('Logging out...');
  }
}
