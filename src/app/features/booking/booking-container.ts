import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { Slot, SlotStatus } from '../../models/slot';
import { AppSelect } from '../../shared/components/app-select/app-select';
import { DateSelector } from './components/date-selector/date-selector';
import { SlotPicker } from './components/slot-picker/slot-picker';

@Component({
  selector: 'app-booking-container',
  imports: [CommonModule, AppSelect, SlotPicker, DateSelector],
  templateUrl: './booking-container.html',
  styleUrl: './booking-container.css',
})
export class BookingContainer {
  slots = signal([
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
  resources = signal([
    { id: '1', name: 'Jorge Beltran' },
    { id: '2', name: 'Camilo Reyes' },
    { id: '3', name: 'Oscar Martinez' },
  ]);
  dateSelected = signal(new Date());

  selectDate(date: Date): void {
    this.dateSelected.set(date);
  }

  slotSelected(slot: Slot): void {
    console.log('Slot selected:', slot);
  }
}
