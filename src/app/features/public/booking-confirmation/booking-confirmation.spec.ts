import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { ConfirmDialog } from '../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../core/services/ui/notification';
import { BookingConfirmation } from './booking-confirmation';

const mockEnvironmentService = {
  config: vi.fn(() => ({
    production: false,
    api: {
      baseUrl: 'http://localhost:3000',
      timeout: 30000,
      auth: { login: '/auth/login' },
      appointments: {
        byDate: '/appointments',
        confirmation: '/appointments/:token',
      },
    },
    features: {
      mockingEnabled: false,
      pushNotifications: false,
      analytics: false,
      serviceWorker: false,
    },
    logging: { level: 'debug', enableConsole: true },
    supabase: { url: '', anonKey: '' },
  })),
  isProduction: vi.fn(() => false),
  isMockingEnabled: vi.fn(() => false),
  getApiBaseUrl: vi.fn(() => 'http://localhost:3000'),
  buildApiUrl: vi.fn((path: string) => `http://localhost:3000${path}`),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

const mockConfirmDialog = {
  confirm: vi.fn().mockResolvedValue(false),
};

const mockAppointmentService = {
  getByDate: vi.fn(),
  updateAppointmentStatus: vi.fn(),
};

describe('BookingConfirmation', () => {
  let component: BookingConfirmation;
  let fixture: ComponentFixture<BookingConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmation],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { token: 'test-token-123' },
              paramMap: {
                get: vi.fn((k: string) =>
                  k === 'token' ? 'test-token-123' : null,
                ),
              },
            },
          },
        },
        { provide: EnvironmentService, useValue: mockEnvironmentService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmDialog, useValue: mockConfirmDialog },
        { provide: AppointmentService, useValue: mockAppointmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingConfirmation);
    component = fixture.componentInstance;
    // Don't call detectChanges - httpResource makes HTTP call on init
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have token from route', () => {
    expect(component.token).toBe('test-token-123');
  });
});
