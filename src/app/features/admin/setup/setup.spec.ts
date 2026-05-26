import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { BusinessService } from '../../../core/services/business';
import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { ConfirmDialog } from '../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../core/services/ui/notification';
import { BUSINESS_MOCK } from '../../../models/__mocks__/business.mock';
import { CATALOG_MOCK } from '../../../models/__mocks__/catalog.mock';
import { RESOURCE_MOCK } from '../../../models/__mocks__/resource.mock';
import { AvatarColorService } from '../../../shared/services/avatar-color.service';
import { Setup } from './setup';

const mockBusinessService = {
  getBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  getMyBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
  updateBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
};

const mockCatalogService = {
  services: vi.fn(() => CATALOG_MOCK),
  getMyServices: vi.fn().mockReturnValue(of(CATALOG_MOCK)),
  createService: vi.fn().mockReturnValue(of(CATALOG_MOCK[0])),
  updateService: vi.fn().mockReturnValue(of(CATALOG_MOCK[0])),
  deleteService: vi.fn().mockReturnValue(of(undefined)),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

const mockConfirmDialog = {
  confirm: vi.fn().mockResolvedValue(true),
};

const mockAvatarColorService = {
  getColor: vi.fn().mockReturnValue('#3B82F6'),
};

describe('Setup', () => {
  let component: Setup;
  let fixture: ComponentFixture<Setup>;

  beforeEach(async () => {
    const resourcesSignal = signal(RESOURCE_MOCK);
    const mockResourceService = {
      resources: resourcesSignal.asReadonly(),
      getMyResources: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
      updateAvailability: vi.fn().mockReturnValue(of(undefined)),
      createResource: vi.fn().mockReturnValue(of(RESOURCE_MOCK[0])),
      updateResource: vi.fn().mockReturnValue(of(RESOURCE_MOCK[0])),
      deleteResource: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [Setup],
      providers: [
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: CatalogService, useValue: mockCatalogService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmDialog, useValue: mockConfirmDialog },
        { provide: AvatarColorService, useValue: mockAvatarColorService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(Setup, {
        set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Setup);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have 4 sections', () => {
      expect(component.sections.length).toBe(4);
    });

    it('should start with info section active', () => {
      expect(component.activeSection()).toBe('info');
    });

    it('should start with no completed sections', () => {
      expect(component.completedSections().size).toBe(0);
    });

    it('allCompleted should be false initially', () => {
      expect(component.allCompleted()).toBe(false);
    });
  });

  describe('setActive()', () => {
    it('should toggle the active section', () => {
      component.setActive('services');
      expect(component.activeSection()).toBe('services');
    });

    it('should close section when clicking the same one', () => {
      component.setActive('info');
      expect(component.activeSection()).toBeNull();
    });
  });
});
