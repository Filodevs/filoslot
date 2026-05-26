import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { BusinessService } from '../../../core/services/business';
import { BUSINESS_MOCK } from '../../../models/__mocks__/business.mock';
import { RESOURCE_MOCK } from '../../../models/__mocks__/resource.mock';
import { BusinessProfile } from './business-profile';

const mockBusinessService = {
  getBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  getBusinessBySlug: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
  getResourcesByBusiness: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
};

describe('BusinessProfile', () => {
  let component: BusinessProfile;
  let fixture: ComponentFixture<BusinessProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProfile],
      providers: [
        provideRouter([]),
        { provide: BusinessService, useValue: mockBusinessService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with no business data', () => {
      expect(component.business()).toBeNull();
    });

    it('should start with businessLoading = false', () => {
      expect(component.businessLoading()).toBe(false);
    });
  });
});
