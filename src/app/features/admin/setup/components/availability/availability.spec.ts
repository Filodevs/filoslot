import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ResourceService } from '../../../../../core/services/resource.service';
import { NotificationService } from '../../../../../core/services/ui/notification';
import { RESOURCE_MOCK } from '../../../../../models/__mocks__/resource.mock';
import { Availability } from './availability';

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('Availability', () => {
  let component: Availability;
  let fixture: ComponentFixture<Availability>;

  beforeEach(async () => {
    const resourcesSignal = signal(RESOURCE_MOCK);
    const mockResourceService = {
      resources: resourcesSignal.asReadonly(),
      getMyResources: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
      updateAvailability: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [Availability],
      providers: [
        { provide: ResourceService, useValue: mockResourceService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(Availability, {
        set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Availability);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with loading = false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should compute resources from ResourceService', () => {
      expect(component.resources()).toEqual(RESOURCE_MOCK);
    });

    it('should auto-select the first resource', () => {
      expect(component.selectedResource()).toEqual(RESOURCE_MOCK[0]);
    });
  });
});
