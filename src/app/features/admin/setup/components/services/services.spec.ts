import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { ConfirmDialog } from '../../../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../../../core/services/ui/notification';
import { CATALOG_MOCK } from '../../../../../models/__mocks__/catalog.mock';
import { Services } from './services';

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

describe('Services', () => {
  let component: Services;
  let fixture: ComponentFixture<Services>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [
        { provide: CatalogService, useValue: mockCatalogService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmDialog, useValue: mockConfirmDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Services);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with showForm = false', () => {
      expect(component.showForm()).toBe(false);
    });

    it('should start with loading = false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should call getMyServices on init', () => {
      expect(mockCatalogService.getMyServices).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should have an invalid form initially', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with correct values', () => {
      component.form.setValue({
        name: 'Corte Clásico',
        price: 20000,
        duration: 30,
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('openForm()', () => {
    it('should set showForm to true', () => {
      component.openForm();
      expect(component.showForm()).toBe(true);
    });
  });
});
