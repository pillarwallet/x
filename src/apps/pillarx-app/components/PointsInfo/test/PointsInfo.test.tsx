import { render, screen } from '@testing-library/react';

// components
import PointsInfo from '../PointsInfo';

const mockIcon = 'https://example.com/icon.png';
const mockValue = '500';
const mockLabel = 'My PX Points';
const mockBeforeValue = '#';
const mockAfterValue = 'PX';

describe('<PointsInfo />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = render(
      <PointsInfo
        icon={mockIcon}
        value={mockValue}
        label={mockLabel}
        beforeValue={mockBeforeValue}
        afterValue={mockAfterValue}
      />
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders with all the data', () => {
    render(
      <PointsInfo
        icon={mockIcon}
        value={mockValue}
        label={mockLabel}
        beforeValue={mockBeforeValue}
        afterValue={mockAfterValue}
      />
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', mockIcon);
    expect(icon).toBeInTheDocument();

    expect(screen.getByText(`${mockBeforeValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockValue}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockAfterValue}`)).toBeInTheDocument();

    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('renders correctly without beforeValue and afterValue', () => {
    render(<PointsInfo icon={mockIcon} value={mockValue} label={mockLabel} />);

    expect(screen.queryByText(`${mockBeforeValue}`)).not.toBeInTheDocument();
    expect(screen.getByText(`${mockValue}`)).toBeInTheDocument();
    expect(screen.queryByText(`${mockAfterValue}`)).not.toBeInTheDocument();
  });

  it('applies the correct styling when isWhite is true', () => {
    render(
      <PointsInfo icon={mockIcon} value={mockValue} label={mockLabel} isWhite />
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('bg-white');
  });

  it('applies the default styling when isWhite is false', () => {
    render(<PointsInfo icon={mockIcon} value={mockValue} label={mockLabel} />);

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('bg-container_grey');
  });
});
