import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import HorizontalToken from '../HorizontalToken';

// images
import defaultLogo from '../../../images/logo-unknown.png';

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
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the logo with the correct src', () => {
    const tree = renderer
      .create(
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      )
      .toJSON() as ReactTestRendererJSON;

    const divElement = tree.children?.find(
      (child) => typeof child === 'object'
    ) as ReactTestRendererJSON;

    const imgProp = divElement.children?.find(
      (child) => typeof child === 'object' && child.type === 'img'
    ) as ReactTestRendererJSON;

    expect(imgProp).not.toBeNull();
    expect(imgProp.type).toBe('img');
    expect(imgProp.props.src).toBe(logo);
  });

  it('renders the default logo when logo is not provided', () => {
    const tree = renderer
      .create(
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      )
      .toJSON() as ReactTestRendererJSON;

    const divElement = tree.children?.find(
      (child) => typeof child === 'object'
    ) as ReactTestRendererJSON;

    const imgProp = divElement.children?.find(
      (child) => typeof child === 'object' && child.type === 'img'
    ) as ReactTestRendererJSON;

    expect(imgProp).not.toBeNull();
    expect(imgProp.type).toBe('img');
    expect(imgProp.props.src).toBe(defaultLogo);
  });

  it('renders the token symbol and name correctly', () => {
    const tree = renderer
      .create(
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
      )
      .toJSON() as ReactTestRendererJSON;

    const divElement = tree.children?.find(
      (child) => typeof child === 'object'
    ) as ReactTestRendererJSON;

    const divElementSecond = divElement.children?.find(
      (child) => typeof child === 'object' && child.type === 'div'
    ) as ReactTestRendererJSON;

    const tokenSymbolProp = divElementSecond.children?.find(
      (child) => typeof child === 'object' && child.type === 'Body'
    ) as ReactTestRendererJSON;

    const tokenNameProp = divElementSecond.children?.find(
      (child) => typeof child === 'object' && child.type === 'BodySmall'
    ) as ReactTestRendererJSON;

    expect(tokenSymbolProp).not.toBeNull();
    expect(tokenSymbolProp?.children).toContain(tokenSymbol);

    expect(tokenNameProp).not.toBeNull();
    expect(tokenNameProp?.children).toContain(tokenName);
  });

  it('renders the token value correctly', () => {
    const tree = renderer
      .create(
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
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
        <HorizontalToken
          tokenIndex={tokenIndex}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast={isLast}
        />
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
        <HorizontalToken
          tokenIndex={3}
          tokenLogo={logo}
          tokenSymbol={tokenSymbol}
          tokenName={tokenName}
          tokenValue={tokenValue}
          percentage={percentage}
          isLast
        />
      )
      .toJSON() as ReactTestRendererJSON;

    expect(tree.type).toBe('div');
    expect(tree.props.className).toContain('mobile:border-b');
    expect(tree.props.className).toContain('mobile:border-[#27262F]');
  });
});
