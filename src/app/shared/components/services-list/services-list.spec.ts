import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CATALOG_MOCK } from '../../../models/__mocks__/catalog.mock';
import { ServicesList } from './services-list';

describe('ServicesList', () => {
  let component: ServicesList;
  let fixture: ComponentFixture<ServicesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesList],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('services', CATALOG_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive services input', () => {
      expect(component.services()).toEqual(CATALOG_MOCK);
    });

    it('should default loading to false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should accept loading = true', () => {
      fixture.componentRef.setInput('loading', true);
      expect(component.loading()).toBe(true);
    });
  });

  describe('rendering', () => {
    it('should render a list of services', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Corte Premium');
      expect(compiled.textContent).toContain('Barba & Ritual');
    });

    it('should render empty list when services is empty', () => {
      fixture.componentRef.setInput('services', []);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Corte Premium');
    });
  });
});
