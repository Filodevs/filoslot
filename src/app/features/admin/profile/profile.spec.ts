import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { BusinessService } from '../../../core/services/business';
import { CatalogService } from '../../../core/services/catalog.service';
import { ResourceService } from '../../../core/services/resource.service';
import { NotificationService } from '../../../core/services/ui/notification';
import { BUSINESS_MOCK } from '../../../models/__mocks__/business.mock';
import { CATALOG_MOCK } from '../../../models/__mocks__/catalog.mock';
import { RESOURCE_MOCK } from '../../../models/__mocks__/resource.mock';
import { Profile } from './profile';

const mockBusinessService = {
  getBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  getMyBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
  updateBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
};

const mockCatalogService = {
  services: vi.fn(() => CATALOG_MOCK),
  getMyServices: vi.fn().mockReturnValue(of(CATALOG_MOCK)),
};

const mockResourceService = {
  resources: vi.fn(() => RESOURCE_MOCK),
  getMyResources: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: CatalogService, useValue: mockCatalogService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should call getMyBusiness on init', () => {
      expect(mockBusinessService.getMyBusiness).toHaveBeenCalled();
    });

    it('should call getMyServices on init', () => {
      expect(mockCatalogService.getMyServices).toHaveBeenCalled();
    });

    it('should call getMyResources on init', () => {
      expect(mockResourceService.getMyResources).toHaveBeenCalled();
    });
  });
});
