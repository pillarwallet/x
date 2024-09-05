import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import EditorialTag from '../EditorialTag';

describe('<EditorialTag />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<EditorialTag label="Tag1" icon="Add" color="blue" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with all props provided', () => {
    render(<EditorialTag label="Tag1" icon="Add" color="blue" />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toHaveStyle({ color: 'blue' });
  });

  it('renders correctly without an icon', () => {
    render(<EditorialTag label="Tag1" color="blue" />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-tag')).toBeNull();
  });

  it('renders correctly without a label', () => {
    render(<EditorialTag icon="Add" color="blue" />);

    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
    expect(screen.queryByText('Tag1')).toBeNull();
  });

  it('renders correctly without color (default to white)', () => {
    render(<EditorialTag label="Tag1" icon="Add" color="default" />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toHaveStyle({ color: 'white' });
  });

  it('renders correctly with only an icon', () => {
    render(<EditorialTag icon="Add" />);

    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
    expect(screen.queryByText('Tag1')).toBeNull();
  });

  it('renders correctly with only a label', () => {
    render(<EditorialTag label="Tag1" />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-tag')).toBeNull();
  });
});
