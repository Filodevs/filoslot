import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

import { Section } from '../../setup';

interface Resource {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-pink-500',
  'from-emerald-500 to-cyan-500',
  'from-orange-500 to-pink-500',
];

@Component({
  selector: 'app-resources',
  imports: [ReactiveFormsModule, InputTextModule],
  templateUrl: './resources.html',
  styleUrl: './resources.css',
})
export class Resources {
  private readonly fb = inject(FormBuilder);

  completed = output<Section>();

  resources = signal<Resource[]>([
    {
      id: '1',
      name: 'Jorge Beltrán',
      role: 'Barbero Senior',
      initials: 'JB',
      color: AVATAR_COLORS[0],
    },
    {
      id: '2',
      name: 'Carlos M.',
      role: 'Estilista',
      initials: 'CM',
      color: AVATAR_COLORS[1],
    },
  ]);

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    role: ['', Validators.required],
  });

  get nameInvalid() {
    return this.form.get('name')?.invalid && this.form.get('name')?.touched;
  }
  get roleInvalid() {
    return this.form.get('role')?.invalid && this.form.get('role')?.touched;
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  editResource(resource: Resource): void {
    this.editingId.set(resource.id);
    this.form.patchValue({ name: resource.name, role: resource.role });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  deleteResource(id: string): void {
    this.resources.update((list) => list.filter((r) => r.id !== id));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, role } = this.form.value;

    if (this.editingId()) {
      this.resources.update((list) =>
        list.map((r) =>
          r.id === this.editingId()
            ? {
                ...r,
                name: name!,
                role: role!,
                initials: this.getInitials(name!),
              }
            : r,
        ),
      );
    } else {
      const newResource: Resource = {
        id: crypto.randomUUID(),
        name: name!,
        role: role!,
        initials: this.getInitials(name!),
        color: this.getColor(this.resources().length),
      };
      this.resources.update((list) => [...list, newResource]);
    }

    this.cancelForm();
  }

  save(): void {
    if (this.resources().length === 0) return;
    // TODO: llamar al servicio HTTP
    this.completed.emit('resources');
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  private getColor(index: number): string {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }
}
