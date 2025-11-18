/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// components
import TransactionInfo from '../TransactionInfo';

// types
import type { TransactionStatusState } from '../../../types/types';

describe('TransactionInfo - Relay Buy Tests', () => {
  const baseProps = {
    status: 'Transaction Complete' as TransactionStatusState,
    userOpHash: '0xUserOpHash123',
    chainId: 1,
    gasFee: '0.001 ETH',
    completedAt: new Date('2024-01-01T12:00:00Z'),
  };

  describe('Intent SDK Buy (useRelayBuy=false)', () => {
    it('should display Resource Lock and Completed hashes separately', () => {
      render(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy={false}
          resourceLockTxHash="0xResourceLock123"
          resourceLockChainId={1}
          completedTxHash="0xCompleted456"
          completedChainId={1}
        />
      );

      // Should show "Resource Lock" and "Completed" labels
      expect(screen.getByText('Resource Lock')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();

      // Should show truncated hashes
      expect(screen.getByText('0xReso...k123')).toBeInTheDocument();
      expect(screen.getByText('0xComp...d456')).toBeInTheDocument();
    });

    it('should show dashes when hashes are missing', () => {
      render(<TransactionInfo {...baseProps} isBuy useRelayBuy={false} />);

      expect(screen.getByText('Resource Lock')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      // Should show dashes for missing hashes
      expect(screen.getAllByText('-')).toHaveLength(2);
    });
  });

  describe('Relay Buy (useRelayBuy=true)', () => {
    it('should display single Tx Hash like Sell', () => {
      render(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy
          txHash="0xTxHash789"
        />
      );

      // Should show "Tx Hash" label (not "Resource Lock" or "Completed")
      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.queryByText('Resource Lock')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed')).not.toBeInTheDocument();

      // Should show truncated txHash
      expect(screen.getByText('0xTxHa...h789')).toBeInTheDocument();
    });

    it('should ignore resourceLockTxHash and completedTxHash', () => {
      render(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy
          txHash="0xTxHash789"
          resourceLockTxHash="0xResourceLock123"
          completedTxHash="0xCompleted456"
        />
      );

      // Should only show txHash
      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.getByText('0xTxHa...h789')).toBeInTheDocument();

      // Should not show Resource Lock or Completed labels
      expect(screen.queryByText('Resource Lock')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed')).not.toBeInTheDocument();
      expect(screen.queryByText('0xReso...k123')).not.toBeInTheDocument();
      expect(screen.queryByText('0xComp...d456')).not.toBeInTheDocument();
    });

    it('should show dash when txHash is missing', () => {
      render(<TransactionInfo {...baseProps} isBuy useRelayBuy />);

      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should not show external link and copy for missing txHash', () => {
      const { container } = render(
        <TransactionInfo {...baseProps} isBuy useRelayBuy />
      );

      // Should not have external link button or copy button when hash is missing
      const externalLinks = container.querySelectorAll('button[type="button"]');
      const copyButtons = container.querySelectorAll(
        '[class*="cursor-pointer"]'
      );

      // No interactive elements for missing hash
      expect(externalLinks.length).toBe(0);
      expect(copyButtons.length).toBe(0);
    });
  });

  describe('Sell (isBuy=false)', () => {
    it('should display single Tx Hash', () => {
      render(
        <TransactionInfo {...baseProps} isBuy={false} txHash="0xTxHash999" />
      );

      // Should show "Tx Hash" label
      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.queryByText('Resource Lock')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed')).not.toBeInTheDocument();

      // Should show truncated txHash
      expect(screen.getByText('0xTxHa...h999')).toBeInTheDocument();
    });
  });

  describe('Comparison: Intent SDK Buy vs Relay Buy vs Sell', () => {
    it('should use different hash display logic for each type', () => {
      // Intent SDK Buy - uses completedTxHash
      const { rerender } = render(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy={false}
          resourceLockTxHash="0xResourceLock123"
          completedTxHash="0xCompleted456"
        />
      );

      expect(screen.getByText('Resource Lock')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();

      // Relay Buy - uses txHash
      rerender(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy
          txHash="0xTxHash789"
        />
      );

      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.queryByText('Resource Lock')).not.toBeInTheDocument();

      // Sell - uses txHash
      rerender(
        <TransactionInfo {...baseProps} isBuy={false} txHash="0xTxHash999" />
      );

      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.queryByText('Resource Lock')).not.toBeInTheDocument();
    });
  });

  describe('Gas Fee and Status (common across all types)', () => {
    it('should display gas fee for Intent SDK Buy', () => {
      render(
        <TransactionInfo
          {...baseProps}
          isBuy
          useRelayBuy={false}
          gasFee="0.002 ETH"
        />
      );

      expect(screen.getByText('Gas Fee')).toBeInTheDocument();
      expect(screen.getByText('0.002 ETH')).toBeInTheDocument();
    });

    it('should display gas fee for Relay Buy', () => {
      render(
        <TransactionInfo {...baseProps} isBuy useRelayBuy gasFee="0.003 ETH" />
      );

      expect(screen.getByText('Gas Fee')).toBeInTheDocument();
      expect(screen.getByText('0.003 ETH')).toBeInTheDocument();
    });

    it('should display gas fee for Sell', () => {
      render(
        <TransactionInfo {...baseProps} isBuy={false} gasFee="0.004 ETH" />
      );

      expect(screen.getByText('Gas Fee')).toBeInTheDocument();
      expect(screen.getByText('0.004 ETH')).toBeInTheDocument();
    });

    it('should display status for all transaction types', () => {
      const { rerender } = render(
        <TransactionInfo {...baseProps} isBuy useRelayBuy={false} />
      );

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();

      rerender(<TransactionInfo {...baseProps} isBuy useRelayBuy />);

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();

      rerender(<TransactionInfo {...baseProps} isBuy={false} />);

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });

  describe('Transaction states', () => {
    it('should handle pending state for Relay Buy', () => {
      render(
        <TransactionInfo
          {...baseProps}
          status="Transaction Pending"
          isBuy
          useRelayBuy
          txHash="0xPending123"
        />
      );

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
    });

    it('should handle failed state for Relay Buy', () => {
      render(
        <TransactionInfo
          {...baseProps}
          status="Transaction Failed"
          isBuy
          useRelayBuy
          txHash="0xFailed456"
        />
      );

      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
    });
  });
});
