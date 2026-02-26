import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { AppointmentStatus } from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { AppDateSelector } from '../../../shared/components/app-date-selector/app-date-selector';
import { AvatarColorPipe } from '../../../shared/pipes/avatar-color.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { RESOURCE_MOCK } from '../../public/booking/__mocks__/resource';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AppDateSelector, InitialsPipe, AvatarColorPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  selectedDate = signal<Date>(new Date());
  resources = signal<IResource[]>(RESOURCE_MOCK);

  servicesByResource = computed(() => {
    //TODO: THIS IS MOCKED, REPLACE WITH REAL DATA
    const servicesMock = [
      { id: 's1', name: 'Corte de cabello', duration: 30 },
      { id: 's2', name: 'Afeitado', duration: 15 },
      { id: 's3', name: 'Corte + Afeitado', duration: 45 },
    ];

    const map = new Map<string, typeof servicesMock>();
    this.resources().forEach((r) => map.set(r.id, servicesMock));
    return map;
  });

  stats = computed(() => {
    const all = this.resources().flatMap((r) => r.appointments);
    return {
      total: all.length,
      completed: all.filter((a) => a?.status === AppointmentStatus.completed)
        .length,
      pending: all.filter((a) => a?.status === AppointmentStatus.pending)
        .length,
    };
  });

  markCompleted(resourceId: string, appointmentId: string): void {
    this.resources.update((list) =>
      list.map((r) =>
        r.id !== resourceId
          ? r
          : {
              ...r,
              appointments: r?.appointments?.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: AppointmentStatus.completed }
                  : a,
              ),
            },
      ),
    );
  }

  cancelAppointment(resourceId: string, appointmentId: string): void {
    this.resources.update((list) =>
      list.map((r) =>
        r.id !== resourceId
          ? r
          : {
              ...r,
              appointments: r?.appointments?.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: AppointmentStatus.canceled }
                  : a,
              ),
            },
      ),
    );
  }

  //TODO: USE A PIPE FOR THIS
  getAppointmentBorder(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.pending]: 'border-l-indigo-500',
      [AppointmentStatus.completed]: 'border-l-green-500',
      [AppointmentStatus.canceled]: 'border-l-red-500/50',
    };
    return map[status];
  }

  getBadgeClass(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.pending]: 'bg-yellow-400/15 text-yellow-300',
      [AppointmentStatus.completed]: 'bg-green-500/15 text-green-400',
      [AppointmentStatus.canceled]: 'bg-red-500/15 text-red-400',
    };
    return map[status];
  }

  getBadgeLabel(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.pending]: 'Pendiente',
      [AppointmentStatus.completed]: 'Completada',
      [AppointmentStatus.canceled]: 'Cancelada',
    };
    return map[status];
  }
}
