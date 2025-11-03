import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import renderer from 'react-test-renderer';
import WalletAddress from '../WalletAddress';

// Mock useIsMobile
vi.mock('../../../../utils/media', () => ({
  useIsMobile: vi.fn(() => false),
}));

describe('<WalletAddress />', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockShortenedAddress = '0x1234...7890';

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<WalletAddress address={mockAddress} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays the full address on desktop', () => {
    render(<WalletAddress address={mockAddress} />);
    expect(screen.getByText(mockAddress)).toBeInTheDocument();
  });

  it('displays shortened address on mobile', async () => {
    const { useIsMobile } = await import('../../../../utils/media');
    vi.mocked(useIsMobile).mockReturnValueOnce(true);

    render(<WalletAddress address={mockAddress} />);
    expect(screen.getByText(mockShortenedAddress)).toBeInTheDocument();
  });

  it('shows copy button', () => {
    render(<WalletAddress address={mockAddress} />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('copies address to clipboard when button is clicked', async () => {
    render(<WalletAddress address={mockAddress} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockAddress);
    });
  });

  it('shows "Copied" after clicking copy button', async () => {
    render(<WalletAddress address={mockAddress} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('resets copied state after 2 seconds', async () => {
    vi.useFakeTimers();
    render(<WalletAddress address={mockAddress} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    
    await act(async () => {
      fireEvent.click(copyButton);
      // Flush promises for async clipboard operation
      await Promise.resolve();
    });

    // Check that "Copied" is now shown
    expect(screen.getByText(/copied/i)).toBeInTheDocument();

    // Advance timers by 2000ms to trigger the reset timeout
    await act(async () => {
      vi.advanceTimersByTime(2000);
      // Flush any pending state updates
      await Promise.resolve();
    });

    // The text should have changed back to "Copy"
    expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
    expect(screen.getByText(/copy/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('displays instruction text', () => {
    render(<WalletAddress address={mockAddress} />);
    expect(
      screen.getByText(/Send assets to this address to receive them in your Key Wallet/i)
    ).toBeInTheDocument();
  });

  it('handles clipboard error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<WalletAddress address={mockAddress} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    // Wait for the async promise rejection to be handled
    await Promise.resolve();
    await Promise.resolve(); // Need to flush the catch block execution

    // Verify the error was logged
    expect(mockWriteText).toHaveBeenCalledWith(mockAddress);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to copy address:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
