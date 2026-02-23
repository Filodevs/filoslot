import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { Section } from '../../setup';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-services',
  imports: [ReactiveFormsModule, InputTextModule, InputNumberModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  readonly fb = inject(FormBuilder);

  services = signal<Service[]>([
    { id: '1', name: 'Corte Premium', price: 25, duration: 30 },
    { id: '2', name: 'Barba & Ritual', price: 15, duration: 45 },
    { id: '3', name: 'Combo FiloSlot', price: 35, duration: 60 },
  ]);

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    duration: [30 as number | null, [Validators.required, Validators.min(5)]],
  });

  completed = output<Section>();

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }

  get priceInvalid() {
    return this.form.get('price')?.invalid && this.form.get('price')?.touched;
  }

  get durationInvalid() {
    return (
      this.form.get('duration')?.invalid && this.form.get('duration')?.touched
    );
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ duration: 30 });
    this.showForm.set(true);
  }

  editService(service: Service): void {
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
      const newService: Service = {
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
