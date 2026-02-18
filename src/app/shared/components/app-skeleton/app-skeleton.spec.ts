import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSkeleton } from './app-skeleton';

describe('Skeleton', () => {
  let component: AppSkeleton;
  let fixture: ComponentFixture<AppSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
