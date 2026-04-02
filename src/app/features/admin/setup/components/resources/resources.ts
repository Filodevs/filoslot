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

import { ResourceService } from '../../../../../core/services/resource.service';
import { ConfirmDialog } from '../../../../../core/services/ui/confirm-dialog';
import { Notification } from '../../../../../core/services/ui/notification';
import { CreateResourceDTO, IResource } from '../../../../../models/resource';
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
export class Resources implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly destroyRef = inject(DestroyRef);
  readonly confirmDialog = inject(ConfirmDialog);
  readonly notifications = inject(Notification);
  readonly resourceService = inject(ResourceService);
  readonly avatarColorService = inject(AvatarColorService);

  resources = signal<IResource[]>([]);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    role: ['', Validators.required],
  });

  completed = output<Section>();

  ngOnInit(): void {
    this._getResources();
  }

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
    this.confirmDialog
      .confirm('¿Estás seguro de eliminar este recurso?')
      .then((confirmed) => {
        if (confirmed) {
          this._deleteResource(id);
        }
      });
  }

  saveResource(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, role } = this.form.value;

    if (this.editingId()) {
      this._updateResource({
        id: this.editingId()!,
        name: name!,
        role: role!,
      });

      return;
    }

    const newResource: CreateResourceDTO = {
      name: name!,
      role: role!,
    };

    this._createResource(newResource);
  }

  private _createResource(resource: CreateResourceDTO): void {
    this.loading.set(true);

    this.resourceService
      .create(resource)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            this.loading.set(false);
            console.warn('No se pudo crear el recurso');
            return;
          }

          this.resources.update((list) => [...list, data]);
          this.cancelForm();
          this.completed.emit('resources');
          this.notifications.showSuccess('Recurso agregado exitosamente');
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.notifications.showError('Error al crear el recurso');
          console.error('Error al crear el recurso:', error);
        },
      });
  }

  private _updateResource(resource: IResource): void {
    this.loading.set(true);
    const { id, name, role } = resource;

    const updateDTO = {
      name,
      role,
    };

    this.resourceService
      .update(id, updateDTO)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.resources.update((list) =>
            list.map((r) => (r.id === id ? { ...r, ...updateDTO } : r)),
          );
          this.cancelForm();
          this.completed.emit('resources');
          this.notifications.showSuccess('Recurso actualizado exitosamente');
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al actualizar el recurso:', error);
          this.notifications.showError('Error al actualizar el recurso');
          this.loading.set(false);
        },
      });
  }

  private _getResources(): void {
    this.resourceService
      .getMyResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            console.warn('No se encontraron recursos');
            return;
          }

          this.resources.set(data);
          this.completed.emit('resources');
        },
        error: (error) => {
          console.error('Error al cargar recursos:', error);
        },
      });
  }

  private _deleteResource(id: string): void {
    this.resourceService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.avatarColorService.removeColor(id);
          this.resources.update((list) => list.filter((r) => r.id !== id));
          this.notifications.showSuccess('Recurso eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar el recurso:', error);
          this.notifications.showError('Error al eliminar el recurso');
        },
      });
  }
}
