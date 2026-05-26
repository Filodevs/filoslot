import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { AppointmentService } from '../../../core/services/appointment.service';
import { PushNotificationService } from '../../../core/services/push-notification.service';
import { ResourceService } from '../../../core/services/resource.service';
import { ConfirmDialog } from '../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../core/services/ui/notification';
import { RESOURCE_MOCK } from '../../../models/__mocks__/resource.mock';
import { Dashboard } from './dashboard';

const mockResourceService = {
  resources: vi.fn(() => RESOURCE_MOCK),
  getMyResources: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
};

const mockAppointmentService = {
  getByDate: vi.fn().mockReturnValue(of([])),
  getAvailableSlots: vi.fn().mockReturnValue(of([])),
  createAppointment: vi.fn().mockReturnValue(of({})),
  updateAppointmentStatus: vi.fn().mockReturnValue(of({})),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

const mockConfirmDialog = {
  confirm: vi.fn().mockResolvedValue(true),
};

const mockPushNotificationService = {
  requestPermission: vi.fn().mockReturnValue(of(undefined)),
  isSupported: vi.fn(() => false),
};

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: ResourceService, useValue: mockResourceService },
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmDialog, useValue: mockConfirmDialog },
        {
          provide: PushNotificationService,
          useValue: mockPushNotificationService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should load resources on init', () => {
      expect(mockResourceService.getMyResources).toHaveBeenCalled();
    });

    it('should load appointments on init', () => {
      expect(mockAppointmentService.getByDate).toHaveBeenCalled();
    });

    it('should start with empty appointmentsByResource', () => {
      expect(component.appointmentsByResource()).toEqual([]);
    });
  });

  describe('stats', () => {
    it('should compute stats with total 0 when no appointments', () => {
      const stats = component.stats();
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.completed).toBe(0);
    });
  });
});
