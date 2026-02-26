import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IResource } from '../../../../../models/resource';
import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { AppInput } from '../../../../../shared/components/app-input/app-input';
import { AvatarColorPipe } from '../../../../../shared/pipes/avatar-color.pipe';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';
import { AvatarColorService } from '../../../../../shared/services/avatar-color.service';
import { Section } from '../../setup.d';

@Component({
  selector: 'app-resources',
  imports: [
    ReactiveFormsModule,
    AppInput,
    AppButton,
    InitialsPipe,
    AvatarColorPipe,
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.css',
})
export class Resources {
  private readonly fb = inject(FormBuilder);
  private readonly avatarColorService = inject(AvatarColorService);

  resources = signal<IResource[]>([]);

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    role: ['', Validators.required],
  });

  completed = output<Section>();

  openForm(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  editResource(resource: IResource): void {
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
    this.avatarColorService.removeColor(id);
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
          r.id === this.editingId() ? { ...r, name: name!, role: role! } : r,
        ),
      );
    } else {
      const newResource: IResource = {
        id: crypto.randomUUID(),
        name: name!,
        role: role!,
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
}
