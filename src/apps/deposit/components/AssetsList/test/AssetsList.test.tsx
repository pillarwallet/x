import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { store } from '../../../../../store';
import AssetsList from '../AssetsList';

const mockAccountAddress = '0x123';
const mockChainId = 1;

describe('<AssetsList />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <AssetsList
            accountAddress={mockAccountAddress}
            chainId={mockChainId}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays loading state initially', async () => {
    render(
      <Provider store={store}>
        <AssetsList accountAddress={mockAccountAddress} chainId={mockChainId} />
      </Provider>
    );

    expect(screen.getByTestId('assets-list-loader')).toBeInTheDocument();
  });
});
