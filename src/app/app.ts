import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ToastModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
