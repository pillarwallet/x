/* eslint-disable @typescript-eslint/no-shadow */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import TokenLogo from '../TokenLogo'; // Assuming the path is correct

// images
import DefaultLogo from '../../../images/logo-unknown.png';

describe('<TokenLogo />', () => {
  const tokenLogo = 'https://example.com/token-logo.png';
  const tokenChainLogo = 'https://example.com/token-chain-logo.png';

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TokenLogo tokenLogo={tokenLogo} tokenChainLogo={tokenChainLogo} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the token logo', () => {
    render(<TokenLogo tokenLogo="token-logo.png" />);
    const tokenLogo = screen.getByAltText('token-logo');
    expect(tokenLogo).toHaveAttribute('src', 'token-logo.png');
  });

  it('renders the default token logo when no token logo is provided', () => {
    render(<TokenLogo />);
    const tokenLogo = screen.getByAltText('token-logo');
    expect(tokenLogo).toHaveAttribute('src', DefaultLogo);
  });

  it('renders the token chain logo', () => {
    render(<TokenLogo tokenChainLogo="token-chain-logo.png" />);
    const tokenChainLogo = screen.getByAltText('chain-logo');
    expect(tokenChainLogo).toHaveAttribute('src', 'token-chain-logo.png');
  });

  it('renders the default token chain logo when no token chain logo is provided', () => {
    render(<TokenLogo />);
    const tokenChainLogo = screen.getByAltText('chain-logo');
    expect(tokenChainLogo).toHaveAttribute('src', DefaultLogo);
  });

  it('applies the correct classes when isBigger is true', () => {
    render(<TokenLogo isBigger />);
    const tokenLogo = screen.getByAltText('token-logo');
    const tokenChainLogo = screen.getByAltText('chain-logo');
    expect(tokenLogo).toHaveClass('w-[30px] h-[30px]');
    expect(tokenChainLogo.parentElement).toHaveClass('w-3.5 h-3.5');
  });

  it('applies the correct classes when isBigger is false', () => {
    render(<TokenLogo isBigger={false} />);
    const tokenLogo = screen.getByAltText('token-logo');
    const tokenChainLogo = screen.getByAltText('chain-logo');
    expect(tokenLogo).toHaveClass('w-5 h-5');
    expect(tokenChainLogo.parentElement).toHaveClass('w-3 h-3');
  });
});
