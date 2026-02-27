import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IBookingDataDTO } from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { IService } from '../../../models/service';
import { ISlot, SlotStatus } from '../../../models/slot';
import { AppButton } from '../../../shared/components/app-button/app-button';
import { AppDateSelector } from '../../../shared/components/app-date-selector/app-date-selector';
import { AppInput } from '../../../shared/components/app-input/app-input';
import { BookingSummary } from './components/booking-summary/booking-summary';
import { ResourceCard } from './components/resource-card/resource-card';
import { ServiceCard } from './components/service-card/service-card';

@Component({
  selector: 'app-booking-container',
  imports: [
    ReactiveFormsModule,
    AppInput,
    AppButton,
    AppDateSelector,
    ServiceCard,
    ResourceCard,
    BookingSummary,
  ],
  templateUrl: './booking-container.html',
})
export class BookingContainer {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  businessName = signal('FiloSlot Barber');
  services = signal<IService[]>([
    { id: 's1', name: 'Corte Premium', price: 25, duration: 30 },
    { id: 's2', name: 'Barba & Ritual', price: 15, duration: 45 },
    { id: 's3', name: 'Combo FiloSlot', price: 35, duration: 60 },
  ]);
  resources = signal<IResource[]>([
    { id: 'r1', name: 'Jorge Beltrán', role: 'Barbero Senior' },
    { id: 'r2', name: 'Carlos M.', role: 'Estilista' },
  ]);
  slots = signal<ISlot[]>([
    {
      id: 'sl1',
      resourceId: 'r1',
      startTime: new Date(),
      endTime: new Date(),
      status: SlotStatus.available,
    },
    {
      id: 'sl2',
      resourceId: 'r1',
      startTime: new Date(),
      endTime: new Date(),
      status: SlotStatus.booked,
    },
    {
      id: 'sl3',
      resourceId: 'r1',
      startTime: new Date(),
      endTime: new Date(),
      status: SlotStatus.available,
    },
    {
      id: 'sl4',
      resourceId: 'r2',
      startTime: new Date(),
      endTime: new Date(),
      status: SlotStatus.available,
    },
  ]);

  selectedService = signal<IService | null>(null);
  selectedResource = signal<IResource | null>(null);
  selectedSlot = signal<ISlot | null>(null);
  selectedDate = signal<Date>(new Date());

  availableSlots = computed(() => {
    const resource = this.selectedResource();
    if (!resource) return [];
    return this.slots().filter(
      (s) => s.resourceId === resource.id && s.status === SlotStatus.available,
    );
  });

  progress = computed(() => {
    let steps = 0;
    if (this.selectedService()) steps++;
    if (this.selectedResource()) steps++;
    if (this.selectedSlot()) steps++;
    return steps;
  });

  canBook = computed(
    () =>
      this.selectedService() !== null &&
      this.selectedResource() !== null &&
      this.selectedSlot() !== null &&
      this.form.valid,
  );

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    userPhone: ['', [Validators.required]],
  });

  isSelected<T extends { id: string }>(item: T, selected: T | null): boolean {
    return selected?.id === item.id;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  selectService(service: IService): void {
    this.selectedService.set(service);
    this.selectedSlot.set(null);
  }

  selectResource(resource: IResource): void {
    this.selectedResource.set(resource);
    this.selectedSlot.set(null);
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
  }

  selectSlot(slot: ISlot): void {
    this.selectedSlot.set(slot);
  }

  goBack(): void {
    const uuid = this.route.snapshot.paramMap.get('businessUuid');
    this.router.navigate(['/business', uuid]);
  }

  onSubmit(): void {
    if (!this.canBook()) {
      this.form.markAllAsTouched();
      return;
    }

    // const payload: IBookingDataDTO = {
    //   serviceId: this.selectedService()!.id,
    //   resourceId: this.selectedResource()!.id,
    //   slotId: this.selectedSlot()!.id,
    //   userName: this.form.value.userName!,
    //   userPhone: this.form.value.userPhone!,
    // };

    // console.log('Booking payload:', payload);
    // TODO: llamar al servicio HTTP y navegar a confirmación
  }
}
