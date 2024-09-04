/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import TokenCard from '../TokenCard';

describe('<TokenCard />', () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    tokenLogo: 'token-logo.png',
    tokenName: 'Test Token',
    tokenSymbol: 'TTK',
    blockchainLogo: 'blockchain-logo.png',
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<TokenCard {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with all props', () => {
    render(<TokenCard {...defaultProps} />);

    const tokenLogo = screen.getByTestId('token-card-token-logo');
    expect(tokenLogo).toHaveAttribute('src', 'token-logo.png');

    const blockchainLogo = screen.getByTestId('token-card-chain-logo');
    expect(blockchainLogo).toHaveAttribute('src', 'blockchain-logo.png');

    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getByText('TTK')).toBeInTheDocument();
  });

  it('renders without tokenLogo and blockchainLogo', () => {
    const propsWithoutLogos = {
      tokenName: undefined,
      tokenSymbol: undefined,
      onClick: mockOnClick,
    };

    render(<TokenCard {...propsWithoutLogos} />);

    expect(
      screen.queryByTestId('token-card-token-logo')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('token-card-chain-logo')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Test Token')).not.toBeInTheDocument();
    expect(screen.queryByText('TTK')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<TokenCard {...defaultProps} />);

    const tokenCard = screen.getByTestId('token-card');
    fireEvent.click(tokenCard);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
