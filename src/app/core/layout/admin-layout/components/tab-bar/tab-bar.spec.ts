import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { TabBar } from './tab-bar';

const mockAuthService = {
  isAuthenticated: vi.fn(() => true),
  currentUser: vi.fn(() => null),
  logout: vi.fn(),
};

describe('TabBar', () => {
  let component: TabBar;
  let fixture: ComponentFixture<TabBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabBar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabs', () => {
    it('should have 3 navigation tabs', () => {
      expect(component.tabs.length).toBe(3);
    });

    it('should include Dashboard, Setup and Perfil tabs', () => {
      const labels = component.tabs.map((t) => t.label);
      expect(labels).toContain('Dashboard');
      expect(labels).toContain('Setup');
      expect(labels).toContain('Perfil');
    });
  });

  describe('logout()', () => {
    it('should call authService.logout', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
});
