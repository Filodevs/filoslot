import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { ResourceService } from '../../../../../core/services/resource.service';
import { ConfirmDialog } from '../../../../../core/services/ui/confirm-dialog';
import { NotificationService } from '../../../../../core/services/ui/notification';
import { CATALOG_MOCK } from '../../../../../models/__mocks__/catalog.mock';
import { RESOURCE_MOCK } from '../../../../../models/__mocks__/resource.mock';
import { AvatarColorService } from '../../../../../shared/services/avatar-color.service';
import { Resources } from './resources';

const mockResourceService = {
  getMyResources: vi.fn().mockReturnValue(of(RESOURCE_MOCK)),
  createResource: vi.fn().mockReturnValue(of(RESOURCE_MOCK[0])),
  updateResource: vi.fn().mockReturnValue(of(RESOURCE_MOCK[0])),
  deleteResource: vi.fn().mockReturnValue(of(undefined)),
};

const mockCatalogService = {
  services: vi.fn(() => CATALOG_MOCK),
  getMyServices: vi.fn().mockReturnValue(of(CATALOG_MOCK)),
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

describe('Resources', () => {
  let component: Resources;
  let fixture: ComponentFixture<Resources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resources],
      providers: [
        { provide: ResourceService, useValue: mockResourceService },
        { provide: CatalogService, useValue: mockCatalogService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmDialog, useValue: mockConfirmDialog },
        { provide: AvatarColorService, useValue: mockAvatarColorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Resources);
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

    it('should call getMyResources on init', () => {
      expect(mockResourceService.getMyResources).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with name and role', () => {
      component.form.setValue({ name: 'Juan Barbero', role: 'Barbero' });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('openForm()', () => {
    it('should set showForm to true', () => {
      component.openForm();
      expect(component.showForm()).toBe(true);
    });
  });

  describe('cancelForm()', () => {
    it('should hide the form', () => {
      component.openForm();
      component.cancelForm();
      expect(component.showForm()).toBe(false);
    });
  });
});
