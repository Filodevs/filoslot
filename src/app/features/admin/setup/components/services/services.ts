import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IService } from '../../../../../models/service';
import { AppInput } from '../../../../../shared/components/app-input/app-input';
import { AppInputNumber } from '../../../../../shared/components/app-input-number/app-input-number';
import { Section } from '../../setup.d';

@Component({
  selector: 'app-services',
  imports: [ReactiveFormsModule, AppInput, AppInputNumber],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  readonly fb = inject(FormBuilder);

  services = signal<IService[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    duration: [30 as number | null, [Validators.required, Validators.min(5)]],
  });

  completed = output<Section>();

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
    this.services.update((list) => list.filter((s) => s.id !== id));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, price, duration } = this.form.value;

    if (this.editingId()) {
      this.services.update((list) =>
        list.map((s) =>
          s.id === this.editingId()
            ? { ...s, name: name!, price: price!, duration: duration! }
            : s,
        ),
      );
    } else {
      const newService: IService = {
        id: crypto.randomUUID(),
        name: name!,
        price: price!,
        duration: duration!,
      };
      this.services.update((list) => [...list, newService]);
    }

    this.cancelForm();
  }

  save(): void {
    if (this.services().length === 0) return;

    // TODO: llamar al servicio HTTP
    this.completed.emit('services');
  }
}
