import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import {
  ADMIN_USER_MOCK,
  AUTH_RESPONSE_MOCK,
} from '../../../models/__mocks__/auth.mock';
import { Login } from './login';

const mockAuthService = {
  login: vi.fn().mockReturnValue(of(AUTH_RESPONSE_MOCK)),
  isAuthenticated: vi.fn(() => false),
  currentUser: vi.fn(() => null),
};

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form', () => {
    it('should initialize with empty email and password', () => {
      expect(component.form.value).toEqual({ email: '', password: '' });
    });

    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid with bad email format', () => {
      component.form.setValue({ email: 'not-an-email', password: '123456' });
      expect(component.form.get('email')?.hasError('email')).toBe(true);
    });

    it('should be invalid with password shorter than 6 chars', () => {
      component.form.setValue({ email: 'test@test.com', password: '123' });
      expect(component.form.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be valid with correct data', () => {
      component.form.setValue({ email: 'test@test.com', password: '123456' });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('signals', () => {
    it('should start with isLoading = false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should start with no error message', () => {
      expect(component.errorMsg()).toBeNull();
    });

    it('should start with showPass = false', () => {
      expect(component.showPass()).toBe(false);
    });
  });

  describe('togglePassword()', () => {
    it('should toggle showPass signal', () => {
      expect(component.showPass()).toBe(false);
      component.togglePassword();
      expect(component.showPass()).toBe(true);
      component.togglePassword();
      expect(component.showPass()).toBe(false);
    });
  });

  describe('onSubmit()', () => {
    it('should mark all controls as touched when form is invalid', () => {
      component.onSubmit();
      expect(component.form.get('email')?.touched).toBe(true);
      expect(component.form.get('password')?.touched).toBe(true);
    });

    it('should not call authService.login when form is invalid', () => {
      component.onSubmit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values when valid', () => {
      component.form.setValue({
        email: 'owner@filoslot.com',
        password: '123456',
      });
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'owner@filoslot.com',
        password: '123456',
      });
    });

    it('should navigate to /admin on successful login', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.form.setValue({
        email: 'owner@filoslot.com',
        password: '123456',
      });
      component.onSubmit();
      await fixture.whenStable();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
    });

    it('should set errorMsg on login failure', async () => {
      mockAuthService.login.mockReturnValue(
        throwError(() => new Error('Credenciales incorrectas')),
      );
      component.form.setValue({ email: 'bad@bad.com', password: 'badpass' });
      component.onSubmit();
      await fixture.whenStable();
      expect(component.errorMsg()).toBe('Credenciales incorrectas');
    });

    it('should reset isLoading to false on login failure', async () => {
      mockAuthService.login.mockReturnValue(
        throwError(() => new Error('Error')),
      );
      component.form.setValue({ email: 'bad@bad.com', password: 'badpass' });
      component.onSubmit();
      await fixture.whenStable();
      expect(component.isLoading()).toBe(false);
    });
  });
});
