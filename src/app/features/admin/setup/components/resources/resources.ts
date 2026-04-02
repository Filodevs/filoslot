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
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly resourceService = inject(ResourceService);
  private readonly avatarColorService = inject(AvatarColorService);

  resources = signal<IResource[]>([]);

  showForm = signal(false);
  editingId = signal<string | null>(null);

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
    this.avatarColorService.removeColor(id);
    this.resources.update((list) => list.filter((r) => r.id !== id));
  }

  saveResource(): void {
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

      return;
    }

    const newResource: CreateResourceDTO = {
      name: name!,
      role: role!,
    };

    this._createResource(newResource);
  }

  private _createResource(resource: CreateResourceDTO): void {
    this.resourceService
      .create(resource)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            console.warn('No se pudo crear el recurso');
            return;
          }

          this.resources.update((list) => [...list, data]);
          this.cancelForm();
          this.completed.emit('resources');
        },
        error: (error) => {
          console.error('Error al crear el recurso:', error);
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
}
