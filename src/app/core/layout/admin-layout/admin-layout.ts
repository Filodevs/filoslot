import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '../../../shared/components/footer/footer';
import { Topbar } from '../../../shared/components/topbar/topbar';
import { SidebarNav } from './components/sidebar-nav/sidebar-nav';
import { TabBar } from './components/tab-bar/tab-bar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Topbar, TabBar, SidebarNav, Footer],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
