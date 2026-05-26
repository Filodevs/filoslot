/**
 * PrimeNG Service Mocks
 * Mock implementations for PrimeNG services used in testing
 */

// Mock for PrimeNG DialogService
export const mockPrimeDialogService = {
  open: vi.fn().mockReturnValue({
    onClose: {
      subscribe: vi.fn(),
    },
    close: vi.fn(),
    destroy: vi.fn(),
  }),
  getInstance: vi.fn(),
};

// Mock for PrimeNG MessageService
export const mockPrimeMessageService = {
  add: vi.fn(),
  addAll: vi.fn(),
  clear: vi.fn(),
  messageObserver: {
    subscribe: vi.fn(),
  },
};

// Mock for PrimeNG ConfirmationService
export const mockPrimeConfirmationService = {
  confirm: vi.fn(),
  close: vi.fn(),
  requireConfirmation$: {
    subscribe: vi.fn(),
  },
};

// Mock for PrimeNG DynamicDialogRef
export const mockPrimeDynamicDialogRef = {
  close: vi.fn(),
  destroy: vi.fn(),
  onClose: {
    subscribe: vi.fn(),
  },
  onDestroy: {
    subscribe: vi.fn(),
  },
};

// Mock for PrimeNG DynamicDialogConfig
export const mockPrimeDynamicDialogConfig = {
  data: {},
  header: '',
  width: '50%',
  closable: true,
  dismissableMask: false,
  modal: true,
};
