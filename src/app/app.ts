import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ToastModule, ConfirmDialogModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
