import { TestBed } from '@angular/core/testing';

import { DialogService } from 'primeng/dynamicdialog';

import { Dialog } from './dialog';

const mockPrimeDialogService = {
  open: vi
    .fn()
    .mockReturnValue({
      onClose: { pipe: vi.fn().mockReturnThis(), subscribe: vi.fn() },
    }),
};

describe('Dialog', () => {
  let service: Dialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: mockPrimeDialogService }],
    });
    service = TestBed.inject(Dialog);
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open()', () => {
    it('should call PrimeNG DialogService.open with config', () => {
      const FakeComponent = class {};
      const config = { data: { id: 1 }, header: 'Test Dialog' };

      service.open(FakeComponent as any, config);

      expect(mockPrimeDialogService.open).toHaveBeenCalledWith(
        FakeComponent,
        expect.objectContaining({
          data: { id: 1 },
          header: 'Test Dialog',
          closable: true,
          dismissableMask: true,
        }),
      );
    });

    it('should use default width of 320px when not specified', () => {
      const FakeComponent = class {};
      service.open(FakeComponent as any);

      expect(mockPrimeDialogService.open).toHaveBeenCalledWith(
        FakeComponent,
        expect.objectContaining({ width: '320px' }),
      );
    });

    it('should use custom width when provided', () => {
      const FakeComponent = class {};
      service.open(FakeComponent as any, { width: '600px' });

      expect(mockPrimeDialogService.open).toHaveBeenCalledWith(
        FakeComponent,
        expect.objectContaining({ width: '600px' }),
      );
    });

    it('should include app-dialog in styleClass', () => {
      const FakeComponent = class {};
      service.open(FakeComponent as any);

      expect(mockPrimeDialogService.open).toHaveBeenCalledWith(
        FakeComponent,
        expect.objectContaining({ styleClass: 'app-dialog' }),
      );
    });
  });
});
