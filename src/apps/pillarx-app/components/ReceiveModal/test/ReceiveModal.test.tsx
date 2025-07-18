import * as transactionKit from '@etherspot/transaction-kit';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';

// reducer
import * as reducerHooks from '../../../hooks/useReducerHooks';
import * as walletSlice from '../../../reducer/WalletPortfolioSlice';

// components
import ReceiveModal from '../ReceiveModal';

vi.mock('../../../../../utils/blockchain', () => {
  const original = vi.importActual('../../../../../utils/blockchain');
  return {
    ...original,
    CompatibleChains: [
      { chainId: 1, chainName: 'Ethereum' },
      { chainId: 137, chainName: 'Polygon' },
    ],
    getLogoForChainId: vi.fn(() => 'mocked-logo-url'),
  };
});

vi.mock('../../../hooks/useReducerHooks');
vi.mock('@etherspot/transaction-kit', () => ({
  useWalletAddress: vi.fn(),
}));

describe('<ReceiveModal />', () => {
  const useAppSelectorMock = reducerHooks.useAppSelector as unknown as Mock;
  const useAppDispatchMock = reducerHooks.useAppDispatch as unknown as Mock;

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppDispatchMock.mockReturnValue(mockDispatch);
  });

  it('renders correctly and matches snapshot', () => {
    const tree = render(<ReceiveModal />);
    expect(tree).toMatchSnapshot();
  });

  it('does not render if isReceiveModalOpen is false', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: false } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0x123');

    const { container } = render(<ReceiveModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isReceiveModalOpen is true', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0x123');

    render(<ReceiveModal />);

    expect(screen.getByText(/Receive/i)).toBeInTheDocument();
    expect(screen.getByText(/EVM Address/i)).toBeInTheDocument();
    expect(screen.getByText('0x123')).toBeInTheDocument();
  });

  it('renders fallback text if no address is available', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue(undefined);

    render(<ReceiveModal />);

    expect(
      screen.getByText(/We were not able to retrieve your EVM address/i)
    ).toBeInTheDocument();
  });

  it('closes modal when ESC button is clicked', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0x123');

    const setIsReceiveModalOpenSpy = vi.spyOn(
      walletSlice,
      'setIsReceiveModalOpen'
    );

    render(<ReceiveModal />);

    const escButton = screen.getByText('ESC');
    fireEvent.click(escButton);

    expect(setIsReceiveModalOpenSpy).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'walletPortfolio/setIsReceiveModalOpen',
      payload: false,
    });
  });

  it('renders supported chains', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0xabc');

    render(<ReceiveModal />);

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Polygon')).toBeInTheDocument();
  });

  it('closes modal when ESC key is pressed', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0x123');

    const setIsReceiveModalOpenSpy = vi.spyOn(
      walletSlice,
      'setIsReceiveModalOpen'
    );

    render(<ReceiveModal />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(setIsReceiveModalOpenSpy).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'walletPortfolio/setIsReceiveModalOpen',
      payload: false,
    });
  });

  it('closes modal when clicking outside of it', () => {
    useAppSelectorMock.mockImplementation((cb) =>
      cb({ walletPortfolio: { isReceiveModalOpen: true } })
    );
    (transactionKit.useWalletAddress as Mock).mockReturnValue('0x123');

    const setIsReceiveModalOpenSpy = vi.spyOn(
      walletSlice,
      'setIsReceiveModalOpen'
    );

    const { getByTestId } = render(<ReceiveModal />);

    // Simulate mouse down oustide the modal
    fireEvent.mouseDown(getByTestId('wallet-portfolio-tile-receive-modal'));

    expect(setIsReceiveModalOpenSpy).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'walletPortfolio/setIsReceiveModalOpen',
      payload: false,
    });
  });
});
