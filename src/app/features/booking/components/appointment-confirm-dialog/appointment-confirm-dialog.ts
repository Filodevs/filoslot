import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

export interface AppointmentConfirmDialogData {
  resourceName: string;
  date: Date;
  slotTime: string;
}

export interface AppointmentConfirmDialogResult {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-appointment-confirm-dialog',
  imports: [CommonModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './appointment-confirm-dialog.html',
  styleUrl: './appointment-confirm-dialog.css',
})
export class AppointmentConfirmDialog {
  readonly ref = inject(DynamicDialogRef<AppointmentConfirmDialogResult>);
  readonly config = inject(DynamicDialogConfig<AppointmentConfirmDialogData>);

  userName = '';
  phone = '';

  confirm(): void {
    const result: AppointmentConfirmDialogResult = {
      name: this.userName,
      phone: this.phone,
    };

    this.ref.close(result);
  }
}
