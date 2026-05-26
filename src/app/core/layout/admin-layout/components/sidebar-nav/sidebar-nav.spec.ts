import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { SidebarNav } from './sidebar-nav';

const mockAuthService = {
  isAuthenticated: vi.fn(() => true),
  currentUser: vi.fn(() => null),
  logout: vi.fn(),
};

describe('SidebarNav', () => {
  let component: SidebarNav;
  let fixture: ComponentFixture<SidebarNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNav],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout()', () => {
    it('should call authService.logout', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});
