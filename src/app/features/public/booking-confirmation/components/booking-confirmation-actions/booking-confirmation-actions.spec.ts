import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationActions } from './booking-confirmation-actions';

describe('BookingConfirmationActions', () => {
  let component: BookingConfirmationActions;
  let fixture: ComponentFixture<BookingConfirmationActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmationActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
