import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// services
import * as portfolioService from '../../../../../services/pillarXApiWalletPortfolio';

// utils

// reducer
import * as reducerHooks from '../../../hooks/useReducerHooks';

// compoments
import PrimeTokensBalance from '../PrimeTokensBalance';

// types
import { store } from '../../../../../store';
import { PortfolioData } from '../../../../../types/api';

jest.mock('../../../../../services/pillarXApiWalletPortfolio');
jest.mock('../../../../../utils/number');

describe('<PrimeTokensBalance />', () => {
  const useAppSelectorMock = jest.spyOn(reducerHooks, 'useAppSelector');

  const mockGetPrimeAssetsWithBalances = jest.spyOn(
    portfolioService,
    'getPrimeAssetsWithBalances'
  ) as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = render(
      <Provider store={store}>
        <PrimeTokensBalance />
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when prime balance exists', () => {
    const mockPortfolio = {} as PortfolioData;

    useAppSelectorMock.mockImplementation((selectorFn) =>
      selectorFn({
        walletPortfolio: {
          walletPortfolio: mockPortfolio,
          isWalletPortfolioLoading: false,
        },
      })
    );

    mockGetPrimeAssetsWithBalances.mockReturnValue([
      {
        primeAssets: [{ usd_balance: 123.456 }, { usd_balance: 100 }],
      },
    ]);

    render(<PrimeTokensBalance />);

    expect(
      screen.getByText('Prime Tokens Balance: $223.46')
    ).toBeInTheDocument();
    expect(screen.getByAltText('prime-tokens-icon')).toHaveClass('w-4 h-4');
    expect(screen.getByAltText('prime-tokens-icon')).not.toHaveClass(
      'opacity-50'
    );
    expect(screen.getByText('Prime Tokens Balance: $223.46')).not.toHaveClass(
      'text-opacity-50'
    );
  });

  it('renders balance as $0.00 when total balance is zero', () => {
    const mockPortfolio = {} as PortfolioData;

    useAppSelectorMock.mockImplementation((selectorFn) =>
      selectorFn({
        walletPortfolio: {
          walletPortfolio: mockPortfolio,
          isWalletPortfolioLoading: false,
        },
      })
    );

    mockGetPrimeAssetsWithBalances.mockReturnValue([
      { primeAssets: [{ usd_balance: 0 }] },
    ]);

    render(<PrimeTokensBalance />);

    expect(screen.getByText('Prime Tokens Balance: $0.00')).toBeInTheDocument();
    expect(screen.getByAltText('prime-tokens-icon')).toHaveClass('opacity-50');
    expect(screen.getByText('Prime Tokens Balance: $0.00')).toHaveClass(
      'text-opacity-50'
    );
  });

  it('renders $0.00 when no walletPortfolio exists', () => {
    useAppSelectorMock.mockReturnValue(undefined);

    render(<PrimeTokensBalance />);

    expect(screen.getByText('Prime Tokens Balance: $0.00')).toBeInTheDocument();
    expect(screen.getByAltText('prime-tokens-icon')).toHaveClass('opacity-50');
    expect(screen.getByText('Prime Tokens Balance: $0.00')).toHaveClass(
      'text-opacity-50'
    );
  });

  it('shows tooltip on hover', () => {
    useAppSelectorMock.mockReturnValue(undefined);

    render(<PrimeTokensBalance />);

    const helpIcon = screen.getByAltText('prime-tokens-question-icon');
    expect(helpIcon).toBeInTheDocument();

    fireEvent.mouseEnter(helpIcon);

    expect(
      screen.getByText(
        /Prime Tokens are used for trading and paying gas fees across all chains/i
      )
    ).toBeInTheDocument();

    fireEvent.mouseLeave(helpIcon);

    expect(
      screen.queryByText(
        /Prime Tokens are used for trading and paying gas fees across all chains/i
      )
    ).not.toBeInTheDocument();
  });
});
