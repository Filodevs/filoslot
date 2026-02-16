import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingContainer } from './booking-container';

describe('BookingContainer', () => {
  let component: BookingContainer;
  let fixture: ComponentFixture<BookingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
