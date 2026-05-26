import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RESOURCE_MOCK } from '../../../../../models/__mocks__/resource.mock';
import { AvailabilityResourceCard } from './availability-resource-card';

describe('AvailabilityResourceCard', () => {
  let component: AvailabilityResourceCard;
  let fixture: ComponentFixture<AvailabilityResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityResourceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityResourceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('resource', RESOURCE_MOCK[0]);
    fixture.componentRef.setInput('isSaved', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should receive resource input', () => {
      expect(component.resource()).toEqual(RESOURCE_MOCK[0]);
    });

    it('should receive isSaved input', () => {
      expect(component.isSaved()).toBe(false);
    });

    it('should update isSaved to true', () => {
      fixture.componentRef.setInput('isSaved', true);
      expect(component.isSaved()).toBe(true);
    });
  });

  describe('outputs', () => {
    it('should emit resourceSelectedEvent', () => {
      let emitted: any;
      component.resourceSelectedEvent.subscribe((v: any) => (emitted = v));
      component.resourceSelectedEvent.emit(RESOURCE_MOCK[0]);
      expect(emitted).toEqual(RESOURCE_MOCK[0]);
    });
  });
});
