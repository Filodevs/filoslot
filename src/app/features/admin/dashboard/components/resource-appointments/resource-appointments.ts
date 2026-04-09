import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import {
  AppointmentStatus,
  IAppointmentsByResourceResponseDTO,
} from '../../../../../models/appointment';
import { IResource } from '../../../../../models/resource';
import { AppSkeleton } from '../../../../../shared/components/app-skeleton/app-skeleton';
import { AvatarColorPipe } from '../../../../../shared/pipes/avatar-color.pipe';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';

export interface AppointmentAction {
  resourceId: string;
  appointmentId: string;
}

@Component({
  selector: 'app-resource-appointments',
  imports: [CommonModule, InitialsPipe, AvatarColorPipe, AppSkeleton],
  templateUrl: './resource-appointments.html',
})
export class ResourceAppointments {
  resource = input.required<IResource>();
  appointments = input.required<
    IAppointmentsByResourceResponseDTO[] | undefined
  >();
  loading = input(false);

  completed = output<AppointmentAction>();
  canceled = output<AppointmentAction>();

  isPending(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.pending;
  }

  isCanceled(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.canceled;
  }

  onMarkCompleted(appointmentId: string): void {
    this.completed.emit({ resourceId: this.resource().id, appointmentId });
  }

  onCancelAppointment(appointmentId: string): void {
    this.canceled.emit({ resourceId: this.resource().id, appointmentId });
  }

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
