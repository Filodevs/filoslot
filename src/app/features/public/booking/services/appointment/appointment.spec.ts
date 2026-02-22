import { TestBed } from '@angular/core/testing';

import { Appointment } from './appointment';

describe('Appoinment', () => {
  let service: Appointment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Appointment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
