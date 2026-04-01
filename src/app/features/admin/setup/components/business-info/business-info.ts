import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { Business } from '../../../../../core/services/business';
import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { AppInput } from '../../../../../shared/components/app-input/app-input';
import { Section } from '../../setup.d';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule, ButtonModule, AppInput, AppButton],
  templateUrl: './business-info.html',
  styleUrl: './business-info.css',
})
export class BusinessInfo implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly businessService = inject(Business);
  readonly destroyRef = inject(DestroyRef);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,20}$/)],
    ],
  });

  completed = output<Section>();

  ngOnInit(): void {
    this._getBusiness();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: llamar al servicio HTTP
    this.completed.emit('info');
  }

  private _getBusiness(): void {
    this.businessService
      .getMyBusiness()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            console.warn('No se encontraron datos del negocio');
            return;
          }

          this.form.patchValue({
            name: data.name,
            address: data.address,
            phone: data.phone,
          });

          this.completed.emit('info');
        },
        error: (error) => {
          console.error('Error al cargar datos del negocio:', error);
        },
      });
  }
}
