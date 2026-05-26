import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { startWith, Subject, switchMap } from 'rxjs';

import { AppointmentService } from '../../../core/services/appointment.service';
import { BusinessService } from '../../../core/services/business';
import { SupabaseService } from '../../../core/services/supabase';
import { NotificationService } from '../../../core/services/ui/notification';
import { IBookingDataDTO } from '../../../models/appointment';
import { IBusiness } from '../../../models/business';
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
  styleUrl: './booking-container.css',
})
export class BookingContainer implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly businessService = inject(BusinessService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly notification = inject(NotificationService);
  private readonly supabaseService = inject(SupabaseService);

  private readonly _channelTrigger$ = new Subject<string>();
  readonly slotsStatus = SlotStatus;

  business = signal<IBusiness | null>(null);
  resources = signal<IResource[]>([]);
  slots = signal<ISlot[]>([]);

  loadingServices = signal(true);
  loadingResources = signal(true);
  loadingSlots = signal(false);

  selectedService = signal<IService | null>(null);
  selectedResource = signal<IResource | null>(null);
  selectedSlot = signal<ISlot | null>(null);
  selectedDate = signal<Date>(new Date());

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
      this.formStatus() === 'VALID',
  );

  availableSlots = computed(() =>
    this.slots().filter((s) => s.status === SlotStatus.available),
  );

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    userPhone: ['', [Validators.required]],
  });

  formStatus = toSignal(
    this.form.statusChanges.pipe(startWith(this.form.status)),
  );

  ngOnInit(): void {
    this._listenResourceChanges();
    this._loadData();
  }

  isSelected<T extends { id?: string; start?: string }>(
    item: T,
    selected: T | null,
  ): boolean {
    if (!selected) return false;

    if ('id' in item && item.id && 'id' in selected && selected.id) {
      return item.id === selected.id;
    }

    if (
      'start' in item &&
      item.start &&
      'start' in selected &&
      selected.start
    ) {
      return item.start === selected.start;
    }

    return false;
  }

  selectService(service: IService): void {
    this.selectedService.set(service);
    this.selectedSlot.set(null);
    this.selectedResource.set(null);
    this.slots.set([]);

    this._loadResourcesByService(this.business()!.id, service.id);
  }

  selectResource(resource: IResource): void {
    this.selectedResource.set(resource);
    this.selectedSlot.set(null);
    this._loadSlots();

    this._emitToResourceChanges(resource.id);
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    this._loadSlots();

    this._emitToResourceChanges(this.selectedResource()!.id);
  }

  selectSlot(slot: ISlot): void {
    this.selectedSlot.set(slot);
  }

  goBack(): void {
    const slug = this.route.snapshot.paramMap.get('businessSlug');
    this.router.navigate(['/business', slug]);
  }

  onSubmit(): void {
    if (!this.canBook()) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: IBookingDataDTO = {
      resourceId: this.selectedResource()!.id,
      serviceId: this.selectedService()!.id,
      date: this.selectedDate()?.toISOString().split('T')[0] || '',
      slotStart: this.selectedSlot()?.start || '',
      customerName: this.form.value.userName!,
      customerPhone: this.form.value.userPhone!,
    };

    this.appointmentService
      .createAppointment(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.notification.showSuccess(
            '¡Reserva confirmada!',
            'Tu turno ha sido agendado exitosamente.',
          );

          this.router.navigate([
            '/business',
            this.business()!.slug,
            'booking',
            response.confirmationToken,
          ]);
        },
      });
  }

  private _loadData(): void {
    const slug = this.route.snapshot.paramMap.get('businessSlug');

    if (!slug) {
      this.notification.showError('Negocio no especificado');
      this.router.navigate(['/directory']);
      return;
    }

    this.businessService
      .getBusinessBySlug(slug)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((b) => {
          this.loadingServices.set(false);
          this.loadingResources.set(true);

          this.business.set(b);
          this.selectedService.set(b?.services?.at(0) || null);

          return this.businessService.getResourcesByServiceId(
            b?.id ?? '',
            b?.services?.at(0)?.id ?? '',
          );
        }),
        switchMap((resources) => {
          this.resources.set(resources);
          this.selectedResource.set(resources[0] || null);
          this.loadingResources.set(false);
          this.loadingSlots.set(true);

          if (resources[0]) {
            this._emitToResourceChanges(resources[0].id);
          }

          return this.appointmentService.getAvailableSlots(
            resources[0].id,
            this.selectedService()!.id,
            this.selectedDate(),
          );
        }),
      )
      .subscribe({
        next: (slots) => {
          this.slots.set(slots);
          this.loadingSlots.set(false);
        },
        error: (error) => {
          this.notification.showError(error.message);
          this.loadingResources.set(false);
          this.loadingServices.set(false);
          this.loadingSlots.set(false);
        },
      });
  }

  private _loadResourcesByService(businessId: string, serviceId: string): void {
    if (!serviceId) return;

    this.loadingResources.set(true);

    this.businessService
      .getResourcesByServiceId(businessId, serviceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.resources.set(r);
          this.selectedResource.set(r[0] || null);
          this.loadingResources.set(false);

          if (r[0]) {
            this._loadSlots();
            this._emitToResourceChanges(r[0].id);
          }
        },
      });
  }

  private _loadSlots(): void {
    const resource = this.selectedResource();
    const service = this.selectedService();
    const date = this.selectedDate();

    if (!resource || !service || !date) return;

    this.loadingSlots.set(true);
    this.appointmentService
      .getAvailableSlots(resource.id, service.id, date)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.slots.set(s);
          this.loadingSlots.set(false);
        },
        error: (error) => {
          this.notification.showError(error.message);
          this.loadingSlots.set(false);
        },
      });
  }

  private _listenResourceChanges(): void {
    this._channelTrigger$
      .pipe(
        switchMap((channel) =>
          this.supabaseService.listenToBroadcast<{ slotStart: string }>(
            channel,
            'SLOT_BOOKED',
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ slotStart }) => {
        console.log('Slot booked:', slotStart);
        this._markSlotAsBooked(slotStart);

        if (this.selectedSlot()?.start === slotStart) {
          this.selectedSlot.set(null);
          this.notification.showInfo(
            'El turno seleccionado acaba de ser reservado por otra persona. Por favor, selecciona otro turno disponible.',
          );
        }
      });
  }

  private _emitToResourceChanges(resourceId: string): void {
    const date = this.selectedDate().toISOString().split('T')[0];
    const channel = `slots:${resourceId}:${date}`;

    this._channelTrigger$.next(channel);
  }

  private _markSlotAsBooked(slotStart: string): void {
    const updatedSlots = this.slots().map((slot) => {
      if (slot.start === slotStart) {
        return { ...slot, status: SlotStatus.booked };
      }
      return slot;
    });

    this.slots.set(updatedSlots);
  }
}
