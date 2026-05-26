import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NEVER } from 'rxjs';

import { AppointmentService } from '../../../core/services/appointment.service';
import { BusinessService } from '../../../core/services/business';
import { SupabaseService } from '../../../core/services/supabase';
import { NotificationService } from '../../../core/services/ui/notification';
import { BookingContainer } from './booking-container';

const mockBusinessService = {
  getBusiness: vi.fn(),
  getBusinessBySlug: vi.fn(),
  getResourcesByServiceId: vi.fn(),
  getResourcesByBusiness: vi.fn(),
};

const mockAppointmentService = {
  getAvailableSlots: vi.fn(),
  createAppointment: vi.fn(),
};

const mockSupabaseService = {
  listenToBroadcast: vi.fn().mockReturnValue(NEVER),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('BookingContainer', () => {
  let component: BookingContainer;
  let fixture: ComponentFixture<BookingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingContainer],
      providers: [
        provideRouter([{ path: '**', component: class DummyComponent {} }]),
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have no selected service', () => {
      expect(component.selectedService()).toBeNull();
    });

    it('should have no selected resource', () => {
      expect(component.selectedResource()).toBeNull();
    });

    it('should have progress 0', () => {
      expect(component.progress()).toBe(0);
    });

    it('should have canBook false', () => {
      expect(component.canBook()).toBe(false);
    });
  });

  describe('form', () => {
    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });
  });
});
