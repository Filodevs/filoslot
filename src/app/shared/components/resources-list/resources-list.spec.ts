import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RESOURCE_MOCK } from '../../../models/__mocks__/resource.mock';
import { ResourcesList } from './resources-list';

describe('ResourcesList', () => {
  let component: ResourcesList;
  let fixture: ComponentFixture<ResourcesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesList],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('resources', RESOURCE_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive resources input', () => {
      expect(component.resources()).toEqual(RESOURCE_MOCK);
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
    it('should render resource names', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Jorge Beltrán');
      expect(compiled.textContent).toContain('Carlos M.');
    });
  });
});
