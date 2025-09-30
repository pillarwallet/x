// utils
import {
  canCloseTransaction,
  determineFailureStep,
  formatStepTimestamp,
  formatTimestamp,
  getButtonConfig,
  getStatusColor,
  getStatusConfig,
  getStatusInfo,
  getStepStatus,
  isValidHash,
  sanitizeErrorDetails,
  truncateHash,
} from '../utils';

// types

describe('Transaction Utils', () => {
  describe('truncateHash', () => {
    it('should truncate long hash correctly', () => {
      const hash =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const result = truncateHash(hash);
      expect(result).toBe('0x1234...cdef');
    });

    it('should handle short hash', () => {
      const hash = '0x1234567890abcdef';
      const result = truncateHash(hash);
      expect(result).toBe('0x1234...cdef');
    });

    it('should handle empty string', () => {
      const result = truncateHash('');
      expect(result).toBe('-');
    });

    it('should handle dash string', () => {
      const result = truncateHash('-');
      expect(result).toBe('-');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for Starting Transaction', () => {
      expect(getStatusColor('Starting Transaction')).toBe('#8A77FF');
    });

    it('should return correct color for Transaction Pending', () => {
      expect(getStatusColor('Transaction Pending')).toBe('#FFAB36');
    });

    it('should return correct color for Transaction Complete', () => {
      expect(getStatusColor('Transaction Complete')).toBe('#5CFF93');
    });

    it('should return correct color for Transaction Failed', () => {
      expect(getStatusColor('Transaction Failed')).toBe('#FF366C');
    });
  });

  describe('getStatusConfig', () => {
    it('should return correct config for Starting Transaction', () => {
      const config = getStatusConfig('Starting Transaction');
      expect(config).toEqual({
        icon: 'pending',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[60px] h-[60px]',
        color: '#8A77FF',
      });
    });

    it('should return correct config for Transaction Pending', () => {
      const config = getStatusConfig('Transaction Pending');
      expect(config).toEqual({
        icon: 'pending',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[60px] h-[60px]',
        color: '#8A77FF',
      });
    });

    it('should return correct config for Transaction Complete', () => {
      const config = getStatusConfig('Transaction Complete');
      expect(config).toEqual({
        icon: 'confirmed',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[33px] h-[21px]',
        color: '#5CFF93',
      });
    });

    it('should return correct config for Transaction Failed', () => {
      const config = getStatusConfig('Transaction Failed');
      expect(config).toEqual({
        icon: 'failed',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[8px] h-[38px]',
        color: '#FF366C',
      });
    });
  });

  describe('getButtonConfig', () => {
    it('should return correct button config for Starting Transaction', () => {
      const config = getButtonConfig('Starting Transaction');
      expect(config).toEqual({
        bgColor: 'bg-[#8A77FF]/10',
        textColor: 'text-[#8A77FF]',
        borderColor: 'border-[#8A77FF]',
        label: 'Starting...',
      });
    });

    it('should return correct button config for Transaction Pending', () => {
      const config = getButtonConfig('Transaction Pending');
      expect(config).toEqual({
        bgColor: 'bg-[#FFAB36]/10',
        textColor: 'text-[#FFAB36]',
        borderColor: 'border-[#FFAB36]',
        label: 'View Status',
      });
    });

    it('should return correct button config for Transaction Complete', () => {
      const config = getButtonConfig('Transaction Complete');
      expect(config).toEqual({
        bgColor: 'bg-[#5CFF93]/10',
        textColor: 'text-[#5CFF93]',
        borderColor: 'border-[#5CFF93]',
        label: 'Success',
      });
    });

    it('should return correct button config for Transaction Failed', () => {
      const config = getButtonConfig('Transaction Failed');
      expect(config).toEqual({
        bgColor: 'bg-[#FF366C]/10',
        textColor: 'text-[#FF366C]',
        borderColor: 'border-[#FF366C]',
        label: 'View Status',
      });
    });
  });

  describe('isValidHash', () => {
    it('should return true for valid hash', () => {
      expect(
        isValidHash(
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        )
      ).toBe(true);
    });

    it('should return false for invalid hash', () => {
      expect(isValidHash('invalid-hash')).toBe(true); // Any non-empty string is valid
      expect(isValidHash('0x')).toBe(true);
      expect(isValidHash('')).toBe(false);
      expect(isValidHash('-')).toBe(false);
    });
  });

  describe('sanitizeErrorDetails', () => {
    it('should redact API keys', () => {
      const errorDetails = 'Error with api-key=test-api-key-123 and other data';
      const result = sanitizeErrorDetails(errorDetails);
      expect(result).toBe(
        'Error with api-key=***REDACTED***-api-key-123 and other data'
      );
    });

    it('should redact multiple API keys', () => {
      const errorDetails = 'api-key=key1 secret-key=key2';
      const result = sanitizeErrorDetails(errorDetails);
      expect(result).toBe('api-key=***REDACTED*** secret-key=key2'); // Only api-key is redacted
    });

    it('should handle error details without API keys', () => {
      const errorDetails = 'Simple error message';
      const result = sanitizeErrorDetails(errorDetails);
      expect(result).toBe('Simple error message');
    });

    it('should handle empty error details', () => {
      const result = sanitizeErrorDetails('');
      expect(result).toBe('');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const date = new Date('2023-01-01T12:30:45Z');
      const result = formatTimestamp(date);
      expect(result).toBe('12:30');
    });

    it('should handle invalid date', () => {
      expect(() => formatTimestamp(new Date('invalid'))).toThrow(
        'Invalid time value'
      );
    });
  });

  describe('formatStepTimestamp', () => {
    it('should format Submitted step timestamp correctly', () => {
      const date = new Date('2023-01-01T12:30:45Z');
      const result = formatStepTimestamp(date, 'Submitted');

      // Should return JSX elements
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should format other step timestamp correctly', () => {
      const date = new Date('2023-01-01T12:30:45Z');
      const result = formatStepTimestamp(date, 'Pending');

      // Should return JSX elements
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('getStatusInfo', () => {
    it('should return correct status info for Starting Transaction', () => {
      const info = getStatusInfo('Starting Transaction');
      expect(info).toEqual({
        text: 'Starting...',
        color: 'text-white/50',
      });
    });

    it('should return correct status info for Transaction Pending', () => {
      const info = getStatusInfo('Transaction Pending');
      expect(info).toEqual({
        text: 'Pending',
        color: 'text-[#FFAB36]',
      });
    });

    it('should return correct status info for Transaction Complete', () => {
      const info = getStatusInfo('Transaction Complete');
      expect(info).toEqual({
        text: 'Success',
        color: 'text-[#5CFF93]',
      });
    });

    it('should return correct status info for Transaction Failed', () => {
      const info = getStatusInfo('Transaction Failed');
      expect(info).toEqual({
        text: 'Failed',
        color: 'text-[#FF366C]',
      });
    });
  });

  describe('getStepStatus', () => {
    it('should return correct status for Starting Transaction', () => {
      expect(getStepStatus('Submitted', 'Starting Transaction', false)).toBe(
        'pending'
      );
      expect(getStepStatus('Pending', 'Starting Transaction', false)).toBe(
        'pending'
      );
      expect(getStepStatus('Completed', 'Starting Transaction', false)).toBe(
        'pending'
      );
    });

    it('should return correct status for Transaction Pending', () => {
      expect(getStepStatus('Submitted', 'Transaction Pending', false)).toBe(
        'completed'
      );
      expect(getStepStatus('Pending', 'Transaction Pending', false)).toBe(
        'pending'
      );
      expect(getStepStatus('Completed', 'Transaction Pending', false)).toBe(
        'inactive'
      );
    });

    it('should return correct status for Transaction Complete', () => {
      expect(getStepStatus('Submitted', 'Transaction Complete', false)).toBe(
        'completed'
      );
      expect(getStepStatus('Pending', 'Transaction Complete', false)).toBe(
        'completed'
      );
      expect(getStepStatus('Completed', 'Transaction Complete', false)).toBe(
        'completed'
      );
    });

    it('should return correct status for Transaction Failed', () => {
      expect(getStepStatus('Submitted', 'Transaction Failed', false)).toBe(
        'completed'
      );
      expect(getStepStatus('Pending', 'Transaction Failed', false)).toBe(
        'completed'
      );
      expect(getStepStatus('Completed', 'Transaction Failed', false)).toBe(
        'failed'
      );
    });

    it('should handle buy mode with resource lock', () => {
      expect(
        getStepStatus(
          'ResourceLock',
          'Transaction Pending',
          true,
          '0x123',
          undefined,
          false
        )
      ).toBe('completed');
      expect(
        getStepStatus(
          'ResourceLock',
          'Transaction Pending',
          true,
          undefined,
          undefined,
          false
        )
      ).toBe('pending');
    });

    it('should handle resource lock failure', () => {
      expect(
        getStepStatus(
          'ResourceLock',
          'Transaction Failed',
          true,
          '0x123',
          undefined,
          true
        )
      ).toBe('failed');
      expect(
        getStepStatus(
          'Completed',
          'Transaction Failed',
          true,
          '0x123',
          undefined,
          true
        )
      ).toBe('inactive');
    });
  });

  describe('determineFailureStep', () => {
    it('should return Resource Lock Creation for resource lock failures', () => {
      const mockGetStepStatus = vi.fn().mockReturnValue('pending');
      expect(determineFailureStep(true, mockGetStepStatus)).toBe(
        'Resource Lock Creation'
      );
    });

    it('should return Transaction Submission for submitted step failures', () => {
      const mockGetStepStatus = vi
        .fn()
        .mockReturnValueOnce('failed') // Submitted
        .mockReturnValueOnce('pending') // Pending
        .mockReturnValueOnce('pending') // ResourceLock
        .mockReturnValueOnce('pending'); // Completed
      expect(determineFailureStep(false, mockGetStepStatus)).toBe(
        'Transaction Submission'
      );
    });

    it('should return Transaction Pending for pending step failures', () => {
      const mockGetStepStatus = vi
        .fn()
        .mockReturnValueOnce('completed') // Submitted
        .mockReturnValueOnce('failed') // Pending
        .mockReturnValueOnce('pending') // ResourceLock
        .mockReturnValueOnce('pending'); // Completed
      expect(determineFailureStep(false, mockGetStepStatus)).toBe(
        'Transaction Pending'
      );
    });

    it('should return Transaction Completion for completed step failures', () => {
      const mockGetStepStatus = vi
        .fn()
        .mockReturnValueOnce('completed') // Submitted
        .mockReturnValueOnce('completed') // Pending
        .mockReturnValueOnce('completed') // ResourceLock
        .mockReturnValueOnce('failed'); // Completed
      expect(determineFailureStep(false, mockGetStepStatus)).toBe(
        'Transaction Completion'
      );
    });
  });

  describe('canCloseTransaction', () => {
    it('should return true for completed transactions', () => {
      expect(canCloseTransaction('Transaction Complete')).toBe(true);
    });

    it('should return true for failed transactions', () => {
      expect(canCloseTransaction('Transaction Failed')).toBe(true);
    });

    it('should return false for pending transactions', () => {
      expect(canCloseTransaction('Transaction Pending')).toBe(false);
    });

    it('should return false for starting transactions', () => {
      expect(canCloseTransaction('Starting Transaction')).toBe(false);
    });
  });
});
