import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShare } from './profile-share';

describe('ProfileShare', () => {
  let component: ProfileShare;
  let fixture: ComponentFixture<ProfileShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileShare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
