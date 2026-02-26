import { Component, computed, input, model, output } from '@angular/core';

interface DayOption {
  fullDate: Date;
  dayName: string;
  dayNumber: number;
}

@Component({
  selector: 'app-date-selector',
  imports: [],
  templateUrl: './app-date-selector.html',
  styleUrl: './app-date-selector.css',
})
export class AppDateSelector {
  showNavigation = input<boolean>(false);

  dateChange = output<Date>();
  selectedDate = model<Date>(new Date());

  readonly DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  readonly MONTH_NAMES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  days = computed<DayOption[]>(() => {
    const base = this.showNavigation() ? this.selectedDate() : new Date();
    const offset = this.showNavigation() ? -2 : 0;

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + offset + i);
      return {
        fullDate: d,
        dayName: this.DAY_LABELS[d.getDay()],
        dayNumber: d.getDate(),
      };
    });
  });

  get formattedDate(): string {
    const d = this.selectedDate();
    return `${this.DAY_LABELS[d.getDay()]} ${d.getDate()} de ${this.MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  isSelected(date: Date): boolean {
    return date.toDateString() === this.selectedDate().toDateString();
  }

  select(date: Date): void {
    this.selectedDate.set(new Date(date));
    this.dateChange.emit(new Date(date));
  }

  prev(): void {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() - 1);
    this.select(d);
  }

  next(): void {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + 1);
    this.select(d);
  }
}
