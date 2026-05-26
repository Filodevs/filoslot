import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationService } from '../../../../../core/services/ui/notification';
import { BookingConfirmationActions } from './booking-confirmation-actions';

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('BookingConfirmationActions', () => {
  let component: BookingConfirmationActions;
  let fixture: ComponentFixture<BookingConfirmationActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmationActions],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationActions);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isPending', true);
    fixture.componentRef.setInput('isCompleted', false);
    fixture.componentRef.setInput('isCanceled', false);
    fixture.componentRef.setInput('canCancel', true);
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive isPending input', () => {
      expect(component.isPending()).toBe(true);
    });

    it('should receive isCompleted input', () => {
      expect(component.isCompleted()).toBe(false);
    });

    it('should receive isCanceled input', () => {
      expect(component.isCanceled()).toBe(false);
    });

    it('should receive canCancel input', () => {
      expect(component.canCancel()).toBe(true);
    });
  });

  describe('outputs', () => {
    it('should emit shareWhatsAppEvent', () => {
      let emitted = false;
      component.shareWhatsAppEvent.subscribe(() => (emitted = true));
      component.shareWhatsAppEvent.emit();
      expect(emitted).toBe(true);
    });

    it('should emit confirmCancelEvent', () => {
      let emitted = false;
      component.confirmCancelEvent.subscribe(() => (emitted = true));
      component.confirmCancelEvent.emit();
      expect(emitted).toBe(true);
    });

    it('should emit goHomeEvent', () => {
      let emitted = false;
      component.goHomeEvent.subscribe(() => (emitted = true));
      component.goHomeEvent.emit();
      expect(emitted).toBe(true);
    });
  });
});
