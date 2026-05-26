import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { BusinessService } from '../../../core/services/business';
import { BUSINESS_MOCK } from '../../../models/__mocks__/business.mock';
import { Directory } from './directory';

const mockBusinessService = {
  getBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
};

describe('Directory', () => {
  let component: Directory;
  let fixture: ComponentFixture<Directory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Directory],
      providers: [
        provideRouter([]),
        { provide: BusinessService, useValue: mockBusinessService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Directory);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should call getBusiness on init', () => {
      expect(mockBusinessService.getBusiness).toHaveBeenCalled();
    });

    it('should have businesses populated after init', () => {
      expect(component.businesses().length).toBe(BUSINESS_MOCK.length);
    });
  });

  describe('filteredBusinesses', () => {
    it('should return all businesses when no search query', () => {
      expect(component.filteredBusinesses().length).toBe(BUSINESS_MOCK.length);
    });

    it('should filter by business name', () => {
      component.searchQuery.set('filoslot');
      fixture.detectChanges();
      const results = component.filteredBusinesses();
      expect(
        results.every((b) => b.name.toLowerCase().includes('filoslot')),
      ).toBe(true);
    });
  });
});
