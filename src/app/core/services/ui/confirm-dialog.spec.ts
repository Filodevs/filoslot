import { TestBed } from '@angular/core/testing';

import { ConfirmationService } from 'primeng/api';

import { ConfirmDialog } from './confirm-dialog';

const mockConfirmationService = {
  confirm: vi.fn(),
  close: vi.fn(),
};

describe('ConfirmDialog', () => {
  let service: ConfirmDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfirmationService, useValue: mockConfirmationService },
      ],
    });
    service = TestBed.inject(ConfirmDialog);
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('confirm()', () => {
    it('should return a Promise', () => {
      mockConfirmationService.confirm.mockImplementation(() => {});
      const result = service.confirm('Are you sure?');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should call ConfirmationService.confirm with message and header', () => {
      service.confirm('Delete item?', 'Confirm Delete');

      expect(mockConfirmationService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Delete item?',
          header: 'Confirm Delete',
        }),
      );
    });

    it('should use default header "Confirmar" when not specified', () => {
      service.confirm('Delete item?');

      expect(mockConfirmationService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ header: 'Confirmar' }),
      );
    });

    it('should resolve true when user accepts', async () => {
      mockConfirmationService.confirm.mockImplementation(({ accept }: any) =>
        accept(),
      );
      const result = await service.confirm('Are you sure?');
      expect(result).toBe(true);
    });

    it('should resolve false when user rejects', async () => {
      mockConfirmationService.confirm.mockImplementation(({ reject }: any) =>
        reject(),
      );
      const result = await service.confirm('Are you sure?');
      expect(result).toBe(false);
    });
  });
});
