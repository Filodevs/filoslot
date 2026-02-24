import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { AppInput } from '../../../../../shared/components/app-input/app-input';
import { Section } from '../../setup.d';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule, ButtonModule, AppInput, AppButton],
  templateUrl: './business-info.html',
  styleUrl: './business-info.css',
})
export class BusinessInfo {
  readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,20}$/)],
    ],
  });

  completed = output<Section>();

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: llamar al servicio HTTP
    this.completed.emit('info');
  }
}
