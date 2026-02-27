import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '../../../shared/components/footer/footer';
import { Topbar } from '../../../shared/components/topbar/topbar';

@Component({
  selector: 'app-public-layout',
  imports: [Topbar, RouterOutlet, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
