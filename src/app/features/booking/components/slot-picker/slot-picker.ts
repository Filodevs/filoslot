import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Resource } from '../../../../models/resource';
import { Slot } from '../../../../models/slot';

@Component({
  selector: 'app-slot-picker',
  imports: [CommonModule],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker {
  slots = input.required<Slot[]>();
  resources = input.required<Resource[]>();

  changeSlot = output<Slot>();

  selectSlot(slot: Slot): void {
    if (slot.status !== 'AVAILABLE') return;

    this.changeSlot.emit(slot);
  }
}
