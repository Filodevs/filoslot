import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationService } from '../../../../../core/services/ui/notification';
import { BUSINESS_MOCK } from '../../../../../models/__mocks__/business.mock';
import { ProfileShare } from './profile-share';

const mockNotificationService = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
};

describe('ProfileShare', () => {
  let component: ProfileShare;
  let fixture: ComponentFixture<ProfileShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileShare],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileShare);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'bookingUrl',
      'https://filoslot.com/business/filoslot-barber',
    );
    fixture.componentRef.setInput('business', BUSINESS_MOCK[0]);
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive bookingUrl input', () => {
      expect(component.bookingUrl()).toBe(
        'https://filoslot.com/business/filoslot-barber',
      );
    });

    it('should receive business input', () => {
      expect(component.business()).toEqual(BUSINESS_MOCK[0]);
    });

    it('should default loading to false', () => {
      expect(component.loading()).toBe(false);
    });
  });
});
