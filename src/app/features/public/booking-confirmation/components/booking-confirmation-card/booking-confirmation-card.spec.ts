import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationService } from '../../../../../core/services/ui/notification';
import {
  AppointmentStatus,
  IAppointmentDetails,
} from '../../../../../models/appointment';
import { BookingConfirmationCard } from './booking-confirmation-card';

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

const APPOINTMENT_DETAILS_MOCK: IAppointmentDetails = {
  id: 'a1',
  clientName: 'Juan Pérez',
  clientPhone: '3001234567',
  date: '2024-06-01',
  startTime: '10:00',
  endTime: '10:30',
  duration: 30,
  status: AppointmentStatus.pending,
  business: { name: 'FiloSlot Barber', address: '123 Razor Street' },
  service: { name: 'Corte Premium', price: 35000, duration: 30 },
  resource: { name: 'Jorge Beltrán' },
};

describe('BookingConfirmationCard', () => {
  let component: BookingConfirmationCard;
  let fixture: ComponentFixture<BookingConfirmationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmationCard],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('appointment', APPOINTMENT_DETAILS_MOCK);
    fixture.componentRef.setInput('isCanceled', false);
    fixture.componentRef.setInput('token', 'test-token-123');
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive appointment input', () => {
      expect(component.appointment()).toEqual(APPOINTMENT_DETAILS_MOCK);
    });

    it('should receive isCanceled input', () => {
      expect(component.isCanceled()).toBe(false);
    });

    it('should receive token input', () => {
      expect(component.token()).toBe('test-token-123');
    });
  });
});
