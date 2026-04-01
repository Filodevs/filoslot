import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { IService } from '../../../../../models/service';
import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { AppInput } from '../../../../../shared/components/app-input/app-input';
import { AppInputNumber } from '../../../../../shared/components/app-input-number/app-input-number';
import { Section } from '../../setup.d';

@Component({
  selector: 'app-services',
  imports: [ReactiveFormsModule, AppInput, AppInputNumber, AppButton],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly destroyRef = inject(DestroyRef);
  readonly catalogService = inject(CatalogService);

  services = signal<IService[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    duration: [30 as number | null, [Validators.required, Validators.min(5)]],
  });

  completed = output<Section>();

  ngOnInit(): void {
    this._getMyServices();
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ duration: 30 });
    this.showForm.set(true);
  }

  editService(service: IService): void {
    this.editingId.set(service.id);
    this.form.patchValue(service);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  deleteService(id: string): void {
    // TODO: Agregar confirmación antes de eliminar
    this._deleteService(id);
  }

  addService(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, price, duration } = this.form.value;

    if (this.editingId()) {
      this._updateService({
        id: this.editingId()!,
        name: name!,
        price: price!,
        duration: duration!,
      });

      return;
    }

    const newService: IService = {
      id: crypto.randomUUID(),
      name: name!,
      price: price!,
      duration: duration!,
    };

    this._createService(newService);
  }

  private _getMyServices(): void {
    this.catalogService
      .getMyServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.services.set(data);

          if (data.length > 0) {
            this.completed.emit('services');
          }
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
        },
      });
  }

  private _createService(service: IService): void {
    const createDTO = {
      name: service.name,
      price: service.price,
      duration: service.duration,
    };

    this.catalogService
      .create(createDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.services.update((list) => [...list, service]);
          this.cancelForm();
          this.completed.emit('services');
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Error al crear servicio:', error);
        },
      });
  }

  private _updateService(service: IService): void {
    const { id, name, price, duration } = service;

    const updateDTO = {
      name,
      price,
      duration,
    };

    this.catalogService
      .update(id, updateDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.services.update((list) =>
            list.map((s) => (s.id === id ? { ...s, ...updateDTO } : s)),
          );
          this.cancelForm();
          this.completed.emit('services');
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Error al actualizar servicio:', error);
        },
      });
  }

  private _deleteService(id: string): void {
    this.catalogService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.services.update((list) => list.filter((s) => s.id !== id));
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
        },
      });
  }
}
