import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { IResource } from '../../../../models/resource';
import { ISlot } from '../../../../models/slot';

@Component({
  selector: 'app-slot-picker',
  imports: [CommonModule],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker {
  slots = input.required<ISlot[]>();
  resources = input.required<IResource[]>();

  changeSlot = output<ISlot>();

  selectSlot(slot: ISlot): void {
    if (slot.status !== 'AVAILABLE') return;

    this.changeSlot.emit(slot);
  }
}
