import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  imports: [CommonModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './appointment-confirm-dialog.html',
  styleUrl: './appointment-confirm-dialog.css',
})
export class AppointmentConfirmDialog {
  readonly ref = inject(DynamicDialogRef<AppointmentConfirmDialogResult>);
  readonly config = inject(DynamicDialogConfig<AppointmentConfirmDialogData>);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)],
    ],
  });

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { userName, phone } = this.form.getRawValue();

    this.ref.close({
      name: userName!,
      phone: phone!,
    });
  }
}
