import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

// test utils
import { TestWrapper } from '../../../../../test-utils/testUtils';

// types

// components
import TokenGraph from '../TokenGraph';

// reducer
import tokenAtlasSlice from '../../../reducer/tokenAtlasSlice';

describe('<TokenGraph />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TestWrapper>
          <TokenGraph />
        </TestWrapper>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the graph with data when available', () => {
    render(
      <TestWrapper>
        <TokenGraph />
      </TestWrapper>
    );

    expect(screen.getByTestId('price-graph')).toBeInTheDocument();
  });

  it('renders the graph container with correct styling', () => {
    render(
      <TestWrapper>
        <TokenGraph />
      </TestWrapper>
    );

    const container = screen.getByTestId('price-graph').parentElement;
    expect(container).toHaveAttribute('id', 'token-atlas-token-graph');
    expect(container).toHaveClass(
      'flex',
      'w-[99%]',
      'mb-20',
      'h-full',
      'max-h-[400px]',
      'mobile:mb-0'
    );
  });

  it('displays a message when no price history is available', () => {
    // Create a custom test store with empty data
    const testStore = configureStore({
      reducer: {
        tokenAtlas: tokenAtlasSlice.reducer,
      },
      preloadedState: {
        tokenAtlas: {
          ...tokenAtlasSlice.getInitialState(),
          tokenDataGraph: { result: { data: [] } },
          isGraphLoading: false,
          isGraphErroring: false,
        },
      },
    });

    render(
      <Provider store={testStore}>
        <TokenGraph />
      </Provider>
    );

    expect(screen.getByText('Price history not found.')).toBeInTheDocument();
  });
});
