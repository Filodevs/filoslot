import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';

interface DayOption {
  fullDate: Date;
  dayName: string;
  dayNumber: number;
  month: string;
}

@Component({
  selector: 'app-date-selector',
  imports: [CommonModule],
  templateUrl: './date-selector.html',
})
export class DateSelector {
  dateSelected = signal(new Date(2026, 1, 16));
  days = signal<DayOption[]>(this._generateDays());

  dateChange = output<Date>();

  selectDate(date: Date): void {
    this.dateSelected.set(date);
    this.dateChange.emit(date);
  }

  isSelected(date: Date): boolean {
    return this.dateSelected().toDateString() === date.toDateString();
  }

  private _generateDays(): DayOption[] {
    const days: DayOption[] = [];
    const start = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(start.getDate() + i);
      days.push({
        fullDate: date,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
      });
    }
    return days;
  }
}
