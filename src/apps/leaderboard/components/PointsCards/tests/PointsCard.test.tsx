import { fireEvent, render, screen } from '@testing-library/react';

// components
import PointsCard from '../PointsCard';

describe('<PointsCard />', () => {
  const mockPointsCardProps = {
    title: 'Trading',
    icon: 'trading-icon.png',
    background: 'bg-blue-500',
    points: 1234,
    rank: 1,
    textTooltip: 'This is a tooltip',
  };

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <PointsCard
        title={mockPointsCardProps.title}
        icon={mockPointsCardProps.icon}
        background={mockPointsCardProps.background}
        points={mockPointsCardProps.points}
        rank={mockPointsCardProps.rank}
        textTooltip={mockPointsCardProps.textTooltip}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders title, icon, points and rank correctly', () => {
    render(
      <PointsCard
        title={mockPointsCardProps.title}
        icon={mockPointsCardProps.icon}
        background={mockPointsCardProps.background}
        points={mockPointsCardProps.points}
        rank={mockPointsCardProps.rank}
        textTooltip={mockPointsCardProps.textTooltip}
      />
    );

    expect(screen.getByText('Trading')).toBeInTheDocument();

    const icon = screen.getByAltText('Trading-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'trading-icon.png');

    expect(screen.getByText(/1234/i)).toBeInTheDocument();
    expect(screen.getByText('PX')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows "–" for rank if rank is undefined', () => {
    render(
      <PointsCard
        title={mockPointsCardProps.title}
        icon={mockPointsCardProps.icon}
        background={mockPointsCardProps.background}
        points={mockPointsCardProps.points}
        rank={undefined}
        textTooltip={mockPointsCardProps.textTooltip}
      />
    );
    expect(screen.getByText('–')).toBeInTheDocument();
  });

  it('renders tooltip only when textTooltip prop is provided', () => {
    render(
      <PointsCard
        title={mockPointsCardProps.title}
        icon={mockPointsCardProps.icon}
        background={mockPointsCardProps.background}
        points={mockPointsCardProps.points}
        rank={mockPointsCardProps.rank}
        textTooltip={mockPointsCardProps.textTooltip}
      />
    );

    const tooltip = screen.getByText('This is a tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('opacity-0');

    fireEvent.mouseOver(screen.getByText('Trading'));
  });

  it('displays zero points correctly', () => {
    render(
      <PointsCard
        title={mockPointsCardProps.title}
        icon={mockPointsCardProps.icon}
        background={mockPointsCardProps.background}
        rank={mockPointsCardProps.rank}
        textTooltip={mockPointsCardProps.textTooltip}
        points={0}
      />
    );
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('PX')).toBeInTheDocument();
  });
});
