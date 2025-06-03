import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { store } from '../../../../../store';
import { BalanceInfo } from '../../../types/types';
import Asset from '../Asset';

const mockToken: BalanceInfo = {
  type: 'BalanceInfo',
  name: 'TokenName',
  chain: 'polygon',
  address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  decimals: 18,
  symbol: 'TNK',
  logoURI: 'https://example.com/logo.png',
  balance: '1000',
};

const mockOnSelectAsset = jest.fn();

describe('<Asset />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Asset
            type="token"
            asset={mockToken}
            onSelectAsset={mockOnSelectAsset}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly for token type with logo', () => {
    render(
      <Provider store={store}>
        <Asset
          type="token"
          asset={mockToken}
          onSelectAsset={mockOnSelectAsset}
        />
      </Provider>
    );

    const tokenLogo = screen.getByAltText('token-logo');

    expect(screen.getByText('TokenName (TNK)')).toBeInTheDocument();
    expect(tokenLogo).toHaveAttribute('src', 'https://example.com/logo.png');
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('polygon')).toBeInTheDocument();
  });

  it('fires onSelectAsset function when clicked on token', () => {
    render(
      <Provider store={store}>
        <Asset
          type="token"
          asset={mockToken}
          onSelectAsset={mockOnSelectAsset}
        />
      </Provider>
    );

    const asset = screen.getByTestId('deposit-asset');
    fireEvent.click(asset);

    expect(mockOnSelectAsset).toHaveBeenCalledTimes(1);
  });
});
