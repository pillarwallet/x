import renderer from 'react-test-renderer';

// components
import TokensHorizontalList from '../TokensHorizontalList';

describe('<TokensHorizontalList />', () => {
  const logos = ['logo1', 'logo2', 'logo3', 'logo4'];

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<TokensHorizontalList logos={logos} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
