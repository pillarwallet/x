import { render, screen } from '@testing-library/react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import HorizontalToken from '../HorizontalToken';

// Mock components
jest.mock('../../Typography/BodySmall', () => 'BodySmall');
jest.mock('../../Typography/Body', () => 'Body');
jest.mock('../../TokensPercentage/TokensPercentage', () => 'TokensPercentage');

describe('<HorizontalToken />', () => {
  const tokenIndex = 1;
  const logo = 'https://example.com/logo.png';
  const tokenSymbol = 'TNS';
  const tokenName = 'Token Name';
  const tokenValue = 123.4567;
  const percentage = 12.34;
  const isLast = false;

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <HorizontalToken
            tokenIndex={tokenIndex}
            tokenLogo={logo}
            tokenSymbol={tokenSymbol}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
            isLast={isLast}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the logo', () => {
    render(
      <Provider store={store}>
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      </Provider>
    );

    expect(screen.getByTestId('horizontal-token-logo')).toBeInTheDocument();
    expect(screen.queryByTestId('random-avatar')).not.toBeInTheDocument();
  });

  it('renders the default logo (random avatar) when logo is not provided', () => {
    render(
      <Provider store={store}>
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      </Provider>
    );

    expect(
      screen.queryByTestId('horizontal-token-logo')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('random-avatar')).toBeInTheDocument();
  });

  it('renders the name correctly', () => {
    render(
      <Provider store={store}>
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      </Provider>
    );

    expect(screen.getByText('Token Name')).toBeInTheDocument();
  });

  it('renders the token value correctly', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <HorizontalToken
            tokenIndex={tokenIndex}
            tokenLogo={logo}
            tokenSymbol={tokenSymbol}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
            isLast={isLast}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;

    const divElement = tree.children?.filter(
      (child) => typeof child === 'object' && child.type === 'div'
    ) as ReactTestRendererJSON[];

    const tokenValueProp = divElement[1].children?.find(
      (child) => typeof child === 'object' && child.type === 'Body'
    ) as ReactTestRendererJSON;

    expect(tokenValueProp).not.toBeNull();
    expect(tokenValueProp.children).toContain(`${tokenValue.toFixed(4)}`);
  });

  it('applies the correct styles', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <HorizontalToken
            tokenIndex={tokenIndex}
            tokenLogo={logo}
            tokenSymbol={tokenSymbol}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
            isLast={isLast}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;

    expect(tree.type).toBe('div');
    expect(tree.props.className).toContain('flex');
    expect(tree.props.className).toContain('w-full');
    expect(tree.props.className).toContain('justify-between');
    expect(tree.props.className).toContain('py-5');
    if (!isLast) {
      expect(tree.props.className).toContain('border-b');
      expect(tree.props.className).toContain('border-[#1F1D23]');
      expect(tree.props.className).toContain('mobile:border-[#27262F]');
    }
  });

  it('applies correct mobile border style for the last token when tokenIndex is 3', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <HorizontalToken
            tokenIndex={3}
            tokenLogo={logo}
            tokenSymbol={tokenSymbol}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
            isLast
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;

    expect(tree.type).toBe('div');
    expect(tree.props.className).toContain('mobile:border-b');
    expect(tree.props.className).toContain('mobile:border-[#27262F]');
  });
});
