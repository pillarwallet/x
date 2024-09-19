import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import TokenListItem from '../TokenListItem';

describe('<TokenListItem />', () => {
  const tokenName = 'Token Example';
  const tokenSymbol = 'TE';
  const chainName = 'Chain Example';
  const tokenLogo = 'https://example.com/token-logo.png';
  const onClickMock = jest.fn();

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TokenListItem
          tokenName={tokenName}
          tokenSymbol={tokenSymbol}
          chainName={chainName}
          onClick={onClickMock}
          tokenLogo={tokenLogo}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders TokenListItem correctly with all the given arguments', () => {
    render(
      <TokenListItem
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        chainName={chainName}
        onClick={onClickMock}
        tokenLogo={tokenLogo}
      />
    );

    expect(screen.getByText(tokenName)).toBeInTheDocument();
    expect(screen.getByText(tokenSymbol)).toBeInTheDocument();
    expect(screen.getByText(`On ${chainName}`)).toBeInTheDocument();
    expect(screen.getByAltText('token-logo')).toHaveAttribute('src', tokenLogo);
  });

  it('renders TokenListItem with default logo (random avatar) when no tokenLogo is provided', () => {
    render(
      <TokenListItem
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        chainName={chainName}
        onClick={onClickMock}
      />
    );

    const defaultLogo = screen.getByTestId('random-avatar');
    expect(defaultLogo).toBeInTheDocument();
  });

  it('calls onClick when TokenListItem is clicked', () => {
    render(
      <TokenListItem
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        chainName={chainName}
        onClick={onClickMock}
        tokenLogo={tokenLogo}
      />
    );

    const listItem = screen
      .getByText(tokenName)
      .closest('div') as HTMLDivElement;
    fireEvent.click(listItem);

    expect(onClickMock).toHaveBeenCalled();
  });

  it('applies correct styles on hover', () => {
    render(
      <TokenListItem
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        chainName={chainName}
        onClick={onClickMock}
        tokenLogo={tokenLogo}
      />
    );

    const listItem = screen
      .getByText(tokenName)
      .closest('div') as HTMLDivElement;
    fireEvent.mouseOver(listItem);

    const bodyElements = screen.findAllByRole('p');
    bodyElements.then((bodyElement) => {
      bodyElement.forEach((body) => {
        expect(body).toHaveClass('group-hover:opacity-60');
      });
    });
  });
});
