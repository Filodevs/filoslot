import { Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { IResource } from '../../../../../models/resource';
import { AppButton } from '../../../../../shared/components/app-button/app-button';
import { Section } from '../../setup.d';

export interface TimeRange {
  start: string;
  end: string;
}

export interface DaySchedule {
  key: string;
  label: string;
  enabled: boolean;
  ranges: TimeRange[];
}

@Component({
  selector: 'app-availability',
  imports: [FormsModule, ToggleSwitchModule, AppButton],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class Availability {
  readonly defaultDays: DaySchedule[] = [
    {
      key: 'mon',
      label: 'LUN',
      enabled: true,
      ranges: [{ start: '09:00', end: '18:00' }],
    },
    {
      key: 'tue',
      label: 'MAR',
      enabled: true,
      ranges: [{ start: '09:00', end: '18:00' }],
    },
    {
      key: 'wed',
      label: 'MIÉ',
      enabled: true,
      ranges: [{ start: '09:00', end: '18:00' }],
    },
    {
      key: 'thu',
      label: 'JUE',
      enabled: true,
      ranges: [{ start: '09:00', end: '18:00' }],
    },
    {
      key: 'fri',
      label: 'VIE',
      enabled: true,
      ranges: [{ start: '09:00', end: '20:00' }],
    },
    {
      key: 'sat',
      label: 'SÁB',
      enabled: false,
      ranges: [{ start: '09:00', end: '14:00' }],
    },
    {
      key: 'sun',
      label: 'DOM',
      enabled: false,
      ranges: [{ start: '09:00', end: '14:00' }],
    },
  ];

  readonly resources = signal<IResource[]>([
    { id: '1', name: 'Jorge Beltrán', role: 'Barbero' },
    { id: '2', name: 'Carlos M.', role: 'Barbero' },
  ]);

  selectedResource = signal<IResource>(this.resources()[0]);

  scheduleMap = signal<Map<string, DaySchedule[]>>(
    new Map(
      this.resources().map((r) => [
        r.id,
        this.defaultDays.map((d) => ({
          ...d,
          ranges: d.ranges.map((r) => ({ ...r })),
        })),
      ]),
    ),
  );

  currentSchedule = computed(
    () => this.scheduleMap().get(this.selectedResource().id) ?? [],
  );

  completed = output<Section>();

  selectResource(resource: IResource): void {
    this.selectedResource.set(resource);
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
    const resourceId = this.selectedResource().id;
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
    // TODO: llamar al servicio HTTP
    this.completed.emit('availability');
  }
}
