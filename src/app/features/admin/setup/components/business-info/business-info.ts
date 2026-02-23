import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { Section } from '../../setup';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './business-info.html',
  styleUrl: './business-info.css',
})
export class BusinessInfo {
  readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', Validators.required],
    phone: ['', Validators.required],
  });

  completed = output<Section>();

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }

  get addressInvalid() {
    return (
      this.form.get('address')?.invalid && this.form.get('address')?.touched
    );
  }

  get phoneInvalid() {
    return this.form.get('phone')?.invalid && this.form.get('phone')?.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: llamar al servicio HTTP
    this.completed.emit('info');
  }
}
