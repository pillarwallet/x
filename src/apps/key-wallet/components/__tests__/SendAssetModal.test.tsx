import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import SendAssetModal from '../SendAssetModal';
import { Asset } from '../../types';

vi.mock('../../../hooks/useTransactionKit', () => ({
  default: () => ({
    kit: undefined,
    walletAddress: undefined,
    setWalletAddress: vi.fn(),
    walletProvider: null,
  }),
}));

// Mock blockchain utils
vi.mock('../../utils/blockchain', async () => {
  const actual = await vi.importActual('../../utils/blockchain');
  return {
    ...actual,
    sendTransaction: vi.fn(),
    switchChain: vi.fn(),
    getCurrentChainId: vi.fn(),
    getChainById: vi.fn((id: number) => ({
      id,
      name: id === 1 ? 'Ethereum' : 'Polygon',
    })),
    formatBalance: vi.fn((value: number) => value.toFixed(4)),
    formatUsdValue: vi.fn((value: number) => `$${value.toFixed(2)}`),
  };
});

const mockAsset: Asset = {
  id: 1,
  name: 'Ethereum',
  symbol: 'ETH',
  logo: '',
  balance: 2.5,
  decimals: 18,
  price: 2500,
  price_change_24h: 0,
  contract: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  chainName: 'Ethereum',
  usdBalance: 6250,
};

describe('<SendAssetModal />', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockWalletProvider = {
    request: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.getCurrentChainId).mockResolvedValue(1);
  });

  it('returns null when asset is null', () => {
    const { container } = render(
      <SendAssetModal
        asset={null}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SendAssetModal
          asset={mockAsset}
          walletProvider={mockWalletProvider}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays asset information', () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Send Asset')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('2.5000')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const closeButton = screen.getByRole('button', { name: /×/ });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal when cancel button is clicked', () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('sets max amount when MAX button is clicked', () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const maxButton = screen.getByRole('button', { name: /max/i });
    fireEvent.click(maxButton);

    const amountInput = screen.getByPlaceholderText('0.0') as HTMLInputElement;
    expect(amountInput.value).toBe('2.5');
  });

  it('validates recipient address', async () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a recipient address/i)).toBeInTheDocument();
    });
  });

  it('validates invalid Ethereum address', async () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, { target: { value: 'invalid-address' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid Ethereum address/i)).toBeInTheDocument();
    });
  });

  it('validates amount is required', async () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid amount/i)).toBeInTheDocument();
    });
  });

  it('validates amount does not exceed balance', async () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '10' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Insufficient balance/i)).toBeInTheDocument();
    });
  });

  it('shows estimated USD value', () => {
    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '1.0' } });

    expect(screen.getByText(/\$2500.00/)).toBeInTheDocument();
  });

  it('sends transaction successfully', async () => {
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.sendTransaction).mockResolvedValue('0xtxhash');

    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '1.0' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(blockchain.sendTransaction).toHaveBeenCalledWith(
        mockAsset,
        '0x1234567890123456789012345678901234567890',
        '1.0',
        mockWalletProvider
      );
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('0xtxhash', 1);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('switches chain when on wrong chain', async () => {
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.getCurrentChainId).mockResolvedValue(137); // Wrong chain
    vi.mocked(blockchain.switchChain).mockResolvedValue(undefined);
    vi.mocked(blockchain.sendTransaction).mockResolvedValue('0xtxhash');

    const polygonAsset: Asset = {
      ...mockAsset,
      chainId: 1, // Asset is on Ethereum but wallet is on Polygon
      chainName: 'Ethereum',
    };

    render(
      <SendAssetModal
        asset={polygonAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Wait for the chain check to complete
    await waitFor(() => {
      expect(blockchain.getCurrentChainId).toHaveBeenCalled();
    });

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '1.0' } });

    // Wait for the button text to update
    await waitFor(() => {
      const sendButton = screen.getByRole('button', { name: /switch.*send|send/i });
      expect(sendButton).toBeInTheDocument();
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(blockchain.switchChain).toHaveBeenCalledWith(1, mockWalletProvider);
    });
  });

  it('handles transaction error', async () => {
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.sendTransaction).mockRejectedValue(
      new Error('Transaction failed')
    );

    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '1.0' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Transaction failed/i)).toBeInTheDocument();
    });
  });

  it('shows warning when on wrong chain', async () => {
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.getCurrentChainId).mockResolvedValue(137); // Wrong chain

    const polygonAsset: Asset = {
      ...mockAsset,
      chainId: 1, // Asset is on Ethereum
      chainName: 'Ethereum',
    };

    render(
      <SendAssetModal
        asset={polygonAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Wrong Network/i)).toBeInTheDocument();
    });
  });

  it('disables inputs when loading', async () => {
    const blockchain = await import('../../utils/blockchain');
    vi.mocked(blockchain.sendTransaction).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('0xtxhash'), 100))
    );

    render(
      <SendAssetModal
        asset={mockAsset}
        walletProvider={mockWalletProvider}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const recipientInput = screen.getByPlaceholderText('0x...');
    fireEvent.change(recipientInput, {
      target: { value: '0x1234567890123456789012345678901234567890' },
    });

    const amountInput = screen.getByPlaceholderText('0.0');
    fireEvent.change(amountInput, { target: { value: '1.0' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Sending.../i)).toBeInTheDocument();
      expect(recipientInput).toBeDisabled();
      expect(amountInput).toBeDisabled();
    });
  });
});
