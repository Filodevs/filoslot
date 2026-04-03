import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ResourceService } from '../../../../../core/services/resource.service';
import { Notification } from '../../../../../core/services/ui/notification';
import { DaySchedule, IResource } from '../../../../../models/resource';
import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { Section } from '../../setup.d';
import { AvailabilityResourceCard } from '../availability-resource-card/availability-resource-card';
import { DAYS_OF_WEEK } from './constants';

@Component({
  selector: 'app-availability',
  imports: [
    CommonModule,
    FormsModule,
    ToggleSwitchModule,
    TabsModule,
    AppButton,
    AvailabilityResourceCard,
  ],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class Availability {
  readonly destroyRef = inject(DestroyRef);
  readonly notifications = inject(Notification);
  readonly resourceService = inject(ResourceService);

  readonly defaultDays: DaySchedule[] = DAYS_OF_WEEK;
  loading = signal(false);

  readonly resources = computed(() => this.resourceService.resources());

  currentSchedule = computed<DaySchedule[]>(
    () => this.scheduleMap().get(this.selectedResource()?.id ?? '') ?? [],
  );
  selectedResource = linkedSignal<IResource[], IResource | null>({
    source: () => this.resources(),
    computation: (resources, previous) => {
      if (
        previous?.value &&
        resources.some((r) => r.id === previous.value?.id)
      ) {
        return previous.value;
      }
      return resources[0] ?? null;
    },
  });

  scheduleMap = linkedSignal<IResource[], Map<string, DaySchedule[]>>({
    source: () => this.resources(),
    computation: (resources, previous) => {
      const existing = previous?.value ?? new Map<string, DaySchedule[]>();
      const newMap = new Map(existing);

      for (const r of resources) {
        const availability = r?.availability?.length
          ? r.availability
          : this.defaultDays;

        if (!newMap.has(r.id)) {
          newMap.set(
            r.id,
            availability.map((d) => ({
              ...d,
              ranges: d.ranges.map((range) => ({ ...range })),
            })),
          );
        }
      }
      return newMap;
    },
  });

  completed = output<Section>();

  selectResource(resource: IResource): void {
    this.selectedResource.set(resource);
  }

  selectResourceById(id: string | number | undefined): void {
    const resource = this.resources().find((r) => r.id === String(id));
    if (resource) this.selectedResource.set(resource);
  }

  toggleDay(key: string): void {
    this.updateDay(key, (d) => ({ ...d, enabled: !d.enabled }));
  }

  addRange(dayKey: string): void {
    this.updateDay(dayKey, (d) => ({
      ...d,
      ranges: [...d.ranges, { start: '09:00', end: '18:00' }],
    }));
  }

  removeRange(dayKey: string, rangeIndex: number): void {
    this.updateDay(dayKey, (d) => ({
      ...d,
      ranges: d.ranges.filter((_, i) => i !== rangeIndex),
    }));
  }

  updateRange(
    dayKey: string,
    rangeIndex: number,
    field: 'start' | 'end',
    value: string,
  ): void {
    this.updateDay(dayKey, (d) => ({
      ...d,
      ranges: d.ranges.map((r, i) =>
        i === rangeIndex ? { ...r, [field]: value } : r,
      ),
    }));
  }

  private updateDay(key: string, fn: (d: DaySchedule) => DaySchedule): void {
    const resourceId = this.selectedResource()?.id;
    if (!resourceId) return;

    this.scheduleMap.update((map) => {
      const newMap = new Map(map);
      newMap.set(
        resourceId,
        (newMap.get(resourceId) ?? []).map((d) => (d.key === key ? fn(d) : d)),
      );
      return newMap;
    });
  }

  save(): void {
    const resourceId = this.selectedResource()?.id;
    if (!resourceId) return;

    const availability = this.scheduleMap().get(resourceId);
    if (!availability) return;

    this._updateAvailability(resourceId, availability);
  }

  private _updateAvailability(
    resourceId: string,
    availability: DaySchedule[],
  ): void {
    this.loading.set(true);

    this.resourceService
      .updateAvailability(resourceId, availability)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (
            this.resources().every(
              (r) => r.availability && r.availability.length > 0,
            )
          ) {
            this.completed.emit('availability');
          }

          this.notifications.showSuccess(
            'Disponibilidad actualizada exitosamente',
          );
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Error al actualizar disponibilidad:', error);
          this.notifications.showError('Error al actualizar disponibilidad');
        },
      });
  }
}
