import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { Notification } from '../../../core/services/ui/notification';
import { IBookingDataDTO } from '../../../models/appointment';
import { IResource } from '../../../models/resource';
import { IService } from '../../../models/service';
import { ISlot, SlotStatus } from '../../../models/slot';
import { AppButton } from '../../../shared/components/app-button/app-button';
import { AppDateSelector } from '../../../shared/components/app-date-selector/app-date-selector';
import { AppInput } from '../../../shared/components/app-input/app-input';
import { AppSkeleton } from '../../../shared/components/app-skeleton/app-skeleton';
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
    AppSkeleton,
    ServiceCard,
    ResourceCard,
    BookingSummary,
  ],
  templateUrl: './booking-container.html',
})
export class BookingContainer implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly catalogService = inject(CatalogService);
  private readonly resourceService = inject(ResourceService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly notification = inject(Notification);

  businessName = signal('FiloSlot Barber');
  services = signal<IService[]>([]);
  resources = signal<IResource[]>([]);
  slots = signal<ISlot[]>([]);

  loadingServices = signal(true);
  loadingResources = signal(true);
  loadingSlots = signal(false);

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

  ngOnInit(): void {
    this._loadData();
  }

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
    this._loadSlots();
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    this._loadSlots();
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

    const payload: IBookingDataDTO = {
      resourceId: this.selectedResource()!.id,
      date: this.selectedDate(),
      slotId: this.selectedSlot()!.id,
      userName: this.form.value.userName!,
      phone: this.form.value.userPhone!,
    };

    this.appointmentService
      .createAppointment(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notification.showSuccess(
            '¡Reserva confirmada!',
            'Tu turno ha sido agendado exitosamente.',
          );
          this.router.navigate(['/directory']);
        },
      });
  }

  private _loadData(): void {
    this.catalogService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.services.set(s);
          this.loadingServices.set(false);
        },
      });

    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.resources.set(r);
          this.loadingResources.set(false);
        },
      });
  }

  private _loadSlots(): void {
    const resource = this.selectedResource();

    if (!resource) return;
    this.loadingSlots.set(true);

    this.appointmentService
      .getAvailableSlots(resource.id, this.selectedDate())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.slots.set(s);
          this.loadingSlots.set(false);
        },
      });
  }
}
