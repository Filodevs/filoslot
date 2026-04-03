import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityResourceCard } from './availability-resource-card';

describe('AvailabilityResourceCard', () => {
  let component: AvailabilityResourceCard;
  let fixture: ComponentFixture<AvailabilityResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityResourceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityResourceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
