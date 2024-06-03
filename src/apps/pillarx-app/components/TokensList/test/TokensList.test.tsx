import renderer from 'react-test-renderer';

// components
import TokensList from '../TokensList';

describe('<TokensList />', () => {
    const logos = ['logo1', 'logo2', 'logo3', 'logo4'];
  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<TokensList logos={logos} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
