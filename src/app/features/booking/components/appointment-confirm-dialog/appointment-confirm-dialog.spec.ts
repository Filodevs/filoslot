import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentConfirmDialog } from './appointment-confirm-dialog';

describe('AppointmentConfirmDialog', () => {
  let component: AppointmentConfirmDialog;
  let fixture: ComponentFixture<AppointmentConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentConfirmDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
