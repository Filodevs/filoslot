import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { Business } from '../../../core/services/business';
import { Dialog } from '../../../core/services/ui/dialog';
import { Notification } from '../../../core/services/ui/notification';
import { IBookingDataDTO } from '../../../models/appointment';
import { IBusinessData } from '../../../models/businessData';
import { IResource } from '../../../models/resource';
import { ISlot } from '../../../models/slot';
import { AppSelect } from '../../../shared/components/app-select/app-select';
import {
  AppointmentConfirmDialog,
  AppointmentConfirmDialogData,
  AppointmentConfirmDialogResult,
} from './components/appointment-confirm-dialog/appointment-confirm-dialog';
import { BusinessInfo } from './components/business-info/business-info';
import { DateSelector } from './components/date-selector/date-selector';
import { SlotPicker } from './components/slot-picker/slot-picker';
import { Appointment } from './services/appointment/appointment';
import { Resource } from './services/resources/resource';

@Component({
  selector: 'app-booking-container',
  imports: [
    CommonModule,
    DynamicDialogModule,
    BusinessInfo,
    AppSelect,
    SlotPicker,
    DateSelector,
  ],
  templateUrl: './booking-container.html',
})
export class BookingContainer implements OnInit {
  private readonly dialog = inject(Dialog);
  private readonly notificationService = inject(Notification);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appointmentService = inject(Appointment);
  private readonly resourceService = inject(Resource);
  private readonly businessService = inject(Business);

  businessData = signal<IBusinessData | null>(null);
  businessLoading = signal(false);
  slots = signal<ISlot[]>([]);
  resources = signal<IResource[]>([]);

  resourceSelected = signal<IResource | null>(null);
  dateSelected = signal(new Date());
  selectedSlot = signal<ISlot | null>(null);
  slotsLoading = signal(false);

  resourceControl = new FormControl<string>('');

  selectDate(date: Date): void {
    this.dateSelected.set(date);

    this._getAvailableSlots();
  }

  selectResource(resourceId: string): void {
    const resource =
      this.resources().find((res) => res.id === resourceId) ?? null;

    if (!resource) return;

    this.resourceSelected.set(resource);
    this._getAvailableSlots();
  }

  openConfirmation(slot: ISlot): void {
    this.selectedSlot.set(slot);

    const slotTime = slot.startTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    this.dialog
      .open<
        AppointmentConfirmDialog,
        AppointmentConfirmDialogData,
        AppointmentConfirmDialogResult
      >(AppointmentConfirmDialog, {
        header: 'Confirmar turno',
        data: {
          resourceName: this.resourceSelected()?.name ?? 'Recurso',
          date: slot.startTime,
          slotTime,
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (!result) return;

        this._save(result, slot);
      });
  }

  ngOnInit(): void {
    this._getBusinessData();
    this._getResources();
  }

  private _getBusinessData(): void {
    this.businessLoading.set(true);

    this.businessService
      .getBusinessData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.businessData.set(data);
          this.businessLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching business data:', err);
          this.businessLoading.set(false);
        },
      });
  }

  private _getResources(): void {
    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resources) => {
          this.resources.set(resources);
          this.resourceSelected.set(resources.at(0) ?? null);
          this.resourceControl.setValue(resources.at(0)?.id ?? '');

          this._getAvailableSlots();
        },
        error: (err) => {
          console.error('Error fetching resources:', err);
        },
      });
  }

  private _getAvailableSlots(): void {
    const resourceId = this.resourceSelected()?.id;
    const date = this.dateSelected();

    if (!resourceId || !date) return;

    this.slotsLoading.set(true);

    this.appointmentService
      .getAvailableSlots(resourceId, date)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (slots) => {
          this.slots.set(slots);
          this.slotsLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching available slots:', err);
          this.slotsLoading.set(false);
        },
      });
  }

  private _save(userData: AppointmentConfirmDialogResult, slot: ISlot): void {
    const payload: IBookingDataDTO = {
      userName: userData.name,
      phone: userData.phone,
      date: slot.startTime,
      slotId: slot.id,
      resourceId: this.resourceSelected()?.id ?? '',
    };

    this.appointmentService
      .createAppointment(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.slots.update((slots) =>
            slots.map((s) =>
              s.id === slot.id ? { ...s, status: 'BOOKED' as const } : s,
            ),
          );

          this.notificationService.showSuccess(
            'Turno reservado',
            `Tu turno para el ${slot.startTime.toLocaleDateString()} a las ${slot.startTime.toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              },
            )} ha sido reservado exitosamente.`,
          );
        },
        error: () => {
          this.notificationService.showError(
            'Error al reservar',
            'Hubo un error al reservar tu turno. Por favor, intenta nuevamente.',
          );
        },
      });
  }
}
