import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CATALOG_MOCK } from '../../../../../models/__mocks__/catalog.mock';
import { RESOURCE_MOCK } from '../../../../../models/__mocks__/resource.mock';
import { ResourceCard } from './resource-card';

describe('ResourceCard', () => {
  let component: ResourceCard;
  let fixture: ComponentFixture<ResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('resource', RESOURCE_MOCK[0]);
    fixture.componentRef.setInput('services', CATALOG_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive resource input', () => {
      expect(component.resource()).toEqual(RESOURCE_MOCK[0]);
    });

    it('should receive services input', () => {
      expect(component.services()).toEqual(CATALOG_MOCK);
    });
  });

  describe('outputs', () => {
    it('should emit editResourceEvent', () => {
      let emittedValue: any;
      component.editResourceEvent.subscribe((v: any) => (emittedValue = v));
      component.editResourceEvent.emit(RESOURCE_MOCK[0]);
      expect(emittedValue).toEqual(RESOURCE_MOCK[0]);
    });

    it('should emit deleteResourceEvent with resource id', () => {
      let emittedId: any;
      component.deleteResourceEvent.subscribe((v: any) => (emittedId = v));
      component.deleteResourceEvent.emit('r1');
      expect(emittedId).toBe('r1');
    });
  });
});
