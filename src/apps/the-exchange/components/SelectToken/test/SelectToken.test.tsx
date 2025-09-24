import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// test utils
import { ExchangeTestWrapper } from '../../../../../test-utils/testUtils';

// types
import { CardPosition } from '../../../utils/types';

// components
import SelectToken from '../SelectToken';

describe('<SelectToken />', () => {
  const mockOnClick = vi.fn();
  const type = CardPosition.SWAP;
  const tokenName = 'Ether';
  const tokenChain = 1;
  const tokenLogo = 'iconEth.png';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <ExchangeTestWrapper>
          <SelectToken
            type={type}
            tokenName={tokenName}
            tokenChain={tokenChain}
            tokenLogo={tokenLogo}
            onClick={mockOnClick}
          />
        </ExchangeTestWrapper>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders SelectToken correctly with arguments', () => {
    render(
      <ExchangeTestWrapper>
        <SelectToken
          type={type}
          tokenName={tokenName}
          tokenChain={tokenChain}
          tokenLogo={tokenLogo}
          onClick={mockOnClick}
        />
      </ExchangeTestWrapper>
    );

    expect(screen.getByText('Ether')).toBeInTheDocument();
    expect(screen.getByText('On Ethereum')).toBeInTheDocument();
  });

  it('renders "Select Token" with type when token is not provided', () => {
    render(
      <ExchangeTestWrapper>
        <SelectToken type={type} onClick={mockOnClick} />
      </ExchangeTestWrapper>
    );

    expect(screen.getByText('Select Token')).toBeInTheDocument();
  });

  it('calls onClick when SelectToken is clicked', () => {
    render(
      <ExchangeTestWrapper>
        <SelectToken
          type={type}
          tokenName={tokenName}
          tokenChain={tokenChain}
          tokenLogo={tokenLogo}
          onClick={mockOnClick}
        />
      </ExchangeTestWrapper>
    );

    const selectTokenElement = screen.getByText('Ether');
    fireEvent.click(selectTokenElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
