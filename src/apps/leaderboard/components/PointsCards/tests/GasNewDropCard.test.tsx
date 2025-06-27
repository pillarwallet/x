import { render, screen } from '@testing-library/react';
import GasNewDropCard from '../GasNewDropCard';

// Mock luxon DateTime.now()
vi.mock('luxon', () => {
  const actualLuxon = vi.requireActual('luxon');
  return {
    ...actualLuxon,
    DateTime: {
      ...actualLuxon.DateTime,
      now: () => actualLuxon.DateTime.fromMillis(1750307487101), // fixed mock time (Oct 19, 2025)
      fromMillis: actualLuxon.DateTime.fromMillis,
    },
  };
});

describe('GasNewDropCard', () => {
  it('matches snapshot with isMigrated = false', () => {
    const { container } = render(
      <GasNewDropCard newDropTime={7 * 24 * 60 * 60 * 1000} />
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with isMigrated = true', () => {
    const { container } = render(
      <GasNewDropCard
        gasUsed={999}
        newDropTime={3 * 24 * 60 * 60 * 1000}
        isMigrated
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders gasUsed and formatted newDropTime when isMigrated is true', () => {
    render(
      <GasNewDropCard
        gasUsed={1234}
        newDropTime={5 * 24 * 60 * 60 * 1000}
        isMigrated
      />
    );

    expect(screen.getByText('Gas Used')).toBeInTheDocument();
    expect(screen.getByText('$1234.00')).toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText(/m$/)).toBeInTheDocument();
  });

  it('does not render gasUsed when isMigrated is false', () => {
    render(
      <GasNewDropCard
        newDropTime={10 * 24 * 60 * 60 * 1000}
        isMigrated={false}
      />
    );

    expect(screen.queryByText('Gas Used')).not.toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText(/m$/)).toBeInTheDocument();
  });

  it('defaults to hiding gasUsed when isMigrated is undefined', () => {
    render(<GasNewDropCard newDropTime={20 * 24 * 60 * 60 * 1000} />);

    expect(screen.queryByText('Gas Used')).not.toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText(/m$/)).toBeInTheDocument();
  });
});
