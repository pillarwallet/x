/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import TransactionErrorBox from '../TransactionErrorBox';

// Mock dependencies
vi.mock('react-copy-to-clipboard', () => ({
  default: ({ children, onCopy, text }: any) => (
    <button
      type="button"
      onClick={() => onCopy(text)}
      data-testid="copy-button"
    >
      {children}
    </button>
  ),
}));

vi.mock('react-icons/md', () => ({
  MdCheck: ({ className }: any) => (
    <div data-testid="check-icon" className={className}>
      ✓
    </div>
  ),
}));

vi.mock('../../assets/arrow-down.svg', () => ({
  default: 'arrow-down.svg',
}));

vi.mock('../../assets/copy-icon.svg', () => ({
  default: 'copy-icon.svg',
}));

vi.mock('../../assets/transaction-failed-details-icon.svg', () => ({
  default: 'transaction-failed-details-icon.svg',
}));

const baseProps = {
  technicalDetails: '{"error": "Transaction failed", "code": 500}',
};

describe('<TransactionErrorBox />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<TransactionErrorBox {...baseProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders basic content', () => {
    it('displays error message and description', () => {
      render(<TransactionErrorBox {...baseProps} />);

      expect(screen.getByText('Transaction failed.')).toBeInTheDocument();
      expect(
        screen.getByText('Something went wrong. Please try again.')
      ).toBeInTheDocument();
    });

    it('displays technical details and copy buttons', () => {
      render(<TransactionErrorBox {...baseProps} />);

      expect(screen.getByText('Technical Details')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
  });

  describe('handles technical details expansion', () => {
    it('starts collapsed by default', () => {
      render(<TransactionErrorBox {...baseProps} />);

      expect(
        screen.queryByText(baseProps.technicalDetails)
      ).not.toBeInTheDocument();
    });

    it('expands when technical details button is clicked', () => {
      render(<TransactionErrorBox {...baseProps} />);

      const expandButton = screen.getByText('Technical Details');
      fireEvent.click(expandButton);

      expect(screen.getByText(baseProps.technicalDetails)).toBeInTheDocument();
    });

    it('collapses when technical details button is clicked again', () => {
      render(<TransactionErrorBox {...baseProps} />);

      const expandButton = screen.getByText('Technical Details');

      // Expand
      fireEvent.click(expandButton);
      expect(screen.getByText(baseProps.technicalDetails)).toBeInTheDocument();

      // Collapse
      fireEvent.click(expandButton);
      expect(
        screen.queryByText(baseProps.technicalDetails)
      ).not.toBeInTheDocument();
    });
  });

  describe('handles copy functionality', () => {
    it('shows check icon after copying', () => {
      render(<TransactionErrorBox {...baseProps} />);

      const copyButton = screen.getByTestId('copy-button');
      fireEvent.click(copyButton);

      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('handles different technical details', () => {
    it('displays default technical details when none provided', () => {
      render(<TransactionErrorBox />);

      const expandButton = screen.getByText('Technical Details');
      fireEvent.click(expandButton);

      expect(
        screen.getByText('Error: No technical details available.')
      ).toBeInTheDocument();
    });

    it('displays custom technical details', () => {
      const customDetails =
        'Custom error details with special characters: @#$%';
      render(<TransactionErrorBox technicalDetails={customDetails} />);

      const expandButton = screen.getByText('Technical Details');
      fireEvent.click(expandButton);

      expect(screen.getByText(customDetails)).toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles undefined technical details', () => {
      render(<TransactionErrorBox technicalDetails={undefined} />);

      const expandButton = screen.getByText('Technical Details');
      fireEvent.click(expandButton);

      expect(
        screen.getByText('Error: No technical details available.')
      ).toBeInTheDocument();
    });
  });
});
