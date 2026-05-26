import { TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { NotificationService } from './notification';

const mockMessageService = {
  add: vi.fn(),
  addAll: vi.fn(),
  clear: vi.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService }],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess()', () => {
    it('should call MessageService.add with severity success', () => {
      service.showSuccess('Guardado correctamente');

      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          detail: 'Guardado correctamente',
          life: 3000,
        }),
      );
    });

    it('should include custom title when provided', () => {
      service.showSuccess('Operación exitosa', 'Éxito');

      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'Éxito',
          detail: 'Operación exitosa',
        }),
      );
    });
  });

  describe('showError()', () => {
    it('should call MessageService.add with severity error and longer life', () => {
      service.showError('Error al guardar');

      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
          detail: 'Error al guardar',
          life: 5000,
        }),
      );
    });
  });

  describe('showInfo()', () => {
    it('should call MessageService.add with severity info', () => {
      service.showInfo('Información del sistema');

      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'info',
          detail: 'Información del sistema',
          life: 3000,
        }),
      );
    });
  });
});
