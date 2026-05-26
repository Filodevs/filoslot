import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Topbar } from './topbar';

const mockAuthService = {
  isAuthenticated: vi.fn(() => false),
  currentUser: vi.fn(() => null),
  logout: vi.fn(),
};

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Topbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signals', () => {
    it('should reflect isAuthenticated from AuthService', () => {
      expect(component.isAuthenticated()).toBe(false);
    });

    it('should return null currentUser when unauthenticated', () => {
      expect(component.currentUser()).toBeNull();
    });
  });
});
