import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { Dialog } from '../../core/services/ui/dialog';
import { BusinessData } from '../../models/businessData';
import { Resource } from '../../models/resource';
import { Slot, SlotStatus } from '../../models/slot';
import { AppSelect } from '../../shared/components/app-select/app-select';
import {
  AppointmentConfirmDialog,
  AppointmentConfirmDialogData,
  AppointmentConfirmDialogResult,
} from './components/appointment-confirm-dialog/appointment-confirm-dialog';
import { BusinessInfo } from './components/business-info/business-info';
import { DateSelector } from './components/date-selector/date-selector';
import { SlotPicker } from './components/slot-picker/slot-picker';

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
export class BookingContainer {
  private readonly dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  businessData = signal<BusinessData>({
    name: 'FiloSlot Barber',
    address: '123 Razor Street, Downtown',
    rating: 4.9,
    reviews: 120,
    services: [
      { name: 'Corte Premium', price: 25 },
      { name: 'Barba & Ritual', price: 15 },
      { name: 'Combo FiloSlot', price: 35 },
    ],
  });
  slots = signal<Slot[]>([
    {
      id: '1',
      startTime: new Date(2026, 1, 16, 9, 0),
      endTime: new Date(2026, 1, 16, 10, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '2',
      startTime: new Date(2026, 1, 16, 10, 0),
      endTime: new Date(2026, 1, 16, 11, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '3',
      startTime: new Date(2026, 1, 16, 11, 0),
      endTime: new Date(2026, 1, 16, 12, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '4',
      startTime: new Date(2026, 1, 16, 12, 0),
      endTime: new Date(2026, 1, 16, 13, 0),
      status: 'BOOKED' as SlotStatus,
    },
    {
      id: '5',
      startTime: new Date(2026, 1, 16, 13, 0),
      endTime: new Date(2026, 1, 16, 14, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '6',
      startTime: new Date(2026, 1, 16, 14, 0),
      endTime: new Date(2026, 1, 16, 15, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '7',
      startTime: new Date(2026, 1, 16, 15, 0),
      endTime: new Date(2026, 1, 16, 16, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
    {
      id: '8',
      startTime: new Date(2026, 1, 16, 16, 0),
      endTime: new Date(2026, 1, 16, 17, 0),
      status: 'AVAILABLE' as SlotStatus,
    },
  ]);
  resources = signal<Resource[]>([
    { id: '1', name: 'Jorge Beltran' },
    { id: '2', name: 'Camilo Reyes' },
    { id: '3', name: 'Oscar Martinez' },
  ]);

  resourceSelected = signal<Resource | null>(null);
  dateSelected = signal(new Date());
  selectedSlot = signal<Slot | null>(null);

  selectDate(date: Date): void {
    this.dateSelected.set(date);
  }

  openConfirmation(slot: Slot) {
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
        console.log('Booking confirmed for slot:', this.selectedSlot(), result);
      });
  }
}
