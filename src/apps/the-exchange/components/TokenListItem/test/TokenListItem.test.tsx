import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// utils
import { limitDigits } from '../../../../token-atlas/utils/converters';

// components
import TokenListItem from '../TokenListItem';

describe('<TokenListItem />', () => {
  const tokenExample = {
    id: 1,
    name: 'Token Example',
    symbol: 'TE',
    logo: 'https://example.com/token-logo.png',
    blockchain: 'Ethereum',
    contract: '0x124',
    decimals: 18,
    balance: 23.456729,
    price: 1.15,
  };

  const onClickMock = jest.fn();

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<TokenListItem token={tokenExample} onClick={onClickMock} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders TokenListItem correctly with all the given arguments', () => {
    render(<TokenListItem token={tokenExample} onClick={onClickMock} />);

    expect(screen.getByText(tokenExample.name)).toBeInTheDocument();
    expect(screen.getByText(tokenExample.symbol)).toBeInTheDocument();
    expect(
      screen.getByText(`${limitDigits(tokenExample.balance)}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `$${(tokenExample.price * tokenExample.balance).toFixed(4)}`
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText('token-logo')).toHaveAttribute(
      'src',
      tokenExample.logo
    );
  });

  it('renders TokenListItem with default logo (random avatar) when no tokenLogo is provided', () => {
    render(
      <TokenListItem
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        token={{ ...tokenExample, logo: undefined }}
        onClick={onClickMock}
      />
    );

    const defaultLogo = screen.getByTestId('random-avatar');
    expect(defaultLogo).toBeInTheDocument();
  });

  it('calls onClick when TokenListItem is clicked', () => {
    render(<TokenListItem token={tokenExample} onClick={onClickMock} />);

    const listItem = screen
      .getByText(tokenExample.name)
      .closest('div') as HTMLDivElement;
    fireEvent.click(listItem);

    expect(onClickMock).toHaveBeenCalled();
  });

  it('applies correct styles on hover', () => {
    render(<TokenListItem token={tokenExample} onClick={onClickMock} />);

    const listItem = screen
      .getByText(tokenExample.name)
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
