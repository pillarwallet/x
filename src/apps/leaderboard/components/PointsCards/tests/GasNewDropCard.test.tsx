import { render, screen } from '@testing-library/react';

// components
import GasNewDropCard from '../GasNewDropCard';

describe('GasNewDropCard', () => {
  it('matches snapshot with isMigrated = false', () => {
    const { container } = render(<GasNewDropCard newDropTime={7} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with isMigrated = true', () => {
    const { container } = render(
      <GasNewDropCard gasUsed={999} newDropTime={3} isMigrated />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders gasUsed and newDropTime when isMigrated is true', () => {
    render(<GasNewDropCard gasUsed={1234} newDropTime={5} isMigrated />);
    expect(screen.getByText('Gas Used')).toBeInTheDocument();
    expect(screen.getByText('$1234')).toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render gasUsed when isMigrated is false', () => {
    render(<GasNewDropCard newDropTime={10} isMigrated={false} />);
    expect(screen.queryByText('Gas Used')).not.toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('defaults to hiding gasUsed when isMigrated is undefined', () => {
    render(<GasNewDropCard newDropTime={20} />);
    expect(screen.queryByText('Gas Used')).not.toBeInTheDocument();
    expect(screen.getByText('Next Drop')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
