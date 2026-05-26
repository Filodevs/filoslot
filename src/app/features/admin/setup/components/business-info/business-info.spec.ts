import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { BusinessService } from '../../../../../core/services/business';
import { NotificationService } from '../../../../../core/services/ui/notification';
import { BUSINESS_MOCK } from '../../../../../models/__mocks__/business.mock';
import { BusinessInfo } from './business-info';

const mockBusinessService = {
  getBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  getMyBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
  updateBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK[0])),
};

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('BusinessInfo', () => {
  let component: BusinessInfo;
  let fixture: ComponentFixture<BusinessInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessInfo],
      providers: [
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with isLoading = false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should call getMyBusiness on init', () => {
      expect(mockBusinessService.getMyBusiness).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with all required fields', () => {
      component.form.setValue({
        name: 'Mi Barbería',
        address: 'Calle 1 # 2-3',
        phone: '+573001234567',
      });
      expect(component.form.valid).toBe(true);
    });
  });
});
