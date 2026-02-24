import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';

import { Section } from '../../setup.d';

export interface DaySchedule {
  key: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface Resource {
  id: string;
  name: string;
}

@Component({
  selector: 'app-availability',
  imports: [ReactiveFormsModule, SelectModule],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class Availability {
  private fb = inject(FormBuilder);
  completed = output<Section>();

  readonly intervals = [
    { label: '15 minutos', value: 15 },
    { label: '30 minutos', value: 30 },
    { label: '45 minutos', value: 45 },
    { label: '60 minutos', value: 60 },
  ];

  readonly defaultDays: DaySchedule[] = [
    { key: 'mon', label: 'LUN', enabled: true, start: '09:00', end: '18:00' },
    { key: 'tue', label: 'MAR', enabled: true, start: '09:00', end: '18:00' },
    { key: 'wed', label: 'MIÉ', enabled: true, start: '09:00', end: '18:00' },
    { key: 'thu', label: 'JUE', enabled: true, start: '09:00', end: '18:00' },
    { key: 'fri', label: 'VIE', enabled: true, start: '09:00', end: '20:00' },
    { key: 'sat', label: 'SÁB', enabled: false, start: '09:00', end: '14:00' },
    { key: 'sun', label: 'DOM', enabled: false, start: '09:00', end: '14:00' },
  ];

  readonly resources = signal<Resource[]>([
    { id: '1', name: 'Jorge Beltrán' },
    { id: '2', name: 'Carlos M.' },
  ]);

  selectedResource = signal<Resource>(this.resources()[0]);

  scheduleMap = signal<Map<string, DaySchedule[]>>(
    new Map(
      this.resources().map((r) => [
        r.id,
        this.defaultDays.map((d) => ({ ...d })),
      ]),
    ),
  );

  intervalMap = signal<Map<string, number>>(
    new Map(this.resources().map((r) => [r.id, 30])),
  );

  // Schedule del recurso seleccionado actualmente
  currentSchedule = computed(
    () => this.scheduleMap().get(this.selectedResource().id) ?? [],
  );

  currentInterval = computed(
    () => this.intervalMap().get(this.selectedResource().id) ?? 30,
  );

  selectResource(resource: Resource): void {
    this.selectedResource.set(resource);
  }

  toggleDay(key: string): void {
    const resourceId = this.selectedResource().id;
    this.scheduleMap.update((map) => {
      const newMap = new Map(map);
      const days = (newMap.get(resourceId) ?? []).map((d) =>
        d.key === key ? { ...d, enabled: !d.enabled } : d,
      );
      newMap.set(resourceId, days);
      return newMap;
    });
  }

  updateTime(key: string, field: 'start' | 'end', value: string): void {
    const resourceId = this.selectedResource().id;
    this.scheduleMap.update((map) => {
      const newMap = new Map(map);
      const days = (newMap.get(resourceId) ?? []).map((d) =>
        d.key === key ? { ...d, [field]: value } : d,
      );
      newMap.set(resourceId, days);
      return newMap;
    });
  }

  updateInterval(value: number): void {
    const resourceId = this.selectedResource().id;
    this.intervalMap.update((map) => {
      const newMap = new Map(map);
      newMap.set(resourceId, value);
      return newMap;
    });
  }

  save(): void {
    // TODO: llamar al servicio HTTP
    this.completed.emit('availability');
  }
}
