import { render, screen } from '@testing-library/react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import TokenInfoHorizontal from '../TokenInfoHorizontal';

describe('<TokenInfoHorizontal />', () => {
  const logo = 'https://example.com/logo.png';
  const tokenName = 'Token Name';
  const tokenValue = 1000;
  const percentage = 5.45;

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the logo', () => {
    render(
      <Provider store={store}>
        <TokenInfoHorizontal
          logo={logo}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
        />
      </Provider>
    );

    expect(
      screen.getByTestId('token-info-horizontal-logo')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('random-avatar')).not.toBeInTheDocument();
  });

  it('renders the default logo (random avatar) when logo is not provided', () => {
    render(
      <Provider store={store}>
        <TokenInfoHorizontal
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
        />
      </Provider>
    );

    expect(screen.getByTestId('random-avatar')).toBeInTheDocument();
    expect(
      screen.queryByTestId('token-info-horizontal-logo')
    ).not.toBeInTheDocument();
  });

  it('renders the token name correctly', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;
    const tokenNameProp = tree.children?.find(
      (child) => typeof child === 'object' && child.type === 'p'
    ) as ReactTestRendererJSON;

    expect(tokenNameProp).not.toBeNull();
    expect(tokenNameProp.type).toBe('p');
    expect(tokenNameProp.children).toContain(tokenName);
  });

  it('does not render the token name', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenValue={tokenValue}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;
    const tokenNameProp = tree.children?.find(
      (child) => typeof child === 'object' && child.type === 'p'
    ) as ReactTestRendererJSON;

    expect(tokenNameProp.children).not.toContain(tokenName);
  });

  it('renders the token value correctly', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;

    const tokenValueProp = tree.children?.filter(
      (child) => typeof child === 'object' && child.type === 'p'
    )[1] as ReactTestRendererJSON;

    expect(tokenValueProp).not.toBeNull();
    expect(tokenValueProp.type).toBe('p');
    expect(tokenValueProp.children).toContain(tokenValue.toFixed(4));
  });

  it('does not render the token value', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenName={tokenName}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;

    const tokenValueProp = tree.children?.find(
      (child) => typeof child === 'object' && child.type === 'p'
    ) as ReactTestRendererJSON;

    expect(tokenValueProp.children).not.toContain(tokenValue.toFixed(4));
  });

  it('applies the correct style', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenInfoHorizontal
            logo={logo}
            tokenName={tokenName}
            tokenValue={tokenValue}
            percentage={percentage}
          />
        </Provider>
      )
      .toJSON() as ReactTestRendererJSON;
    expect(tree.type).toBe('div');
    expect(tree.props.className).toContain('flex');
    expect(tree.props.className).toContain('flex-col');
    expect(tree.props.className).toContain('h-auto');
    expect(tree.props.className).toContain('py-5');
  });
});
