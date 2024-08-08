import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

// types
import { Advertisement, ApiLayout, Projection } from '../../../../../types/api';

// components
import AdvertTile from '../AdvertTile';

describe('<AdvertTile />', () => {
    const mockDataAdvert: Projection = {
        meta: {},
        data: {
            slug: 'placement-slug'
        } as Advertisement,
        layout: ApiLayout.AD,
        id: 'id-advert'
    };

    // Unable to test the component further because very dependant on HypeLab SDK

    it('renders correctly and matches snapshot', () => {
        const tree = renderer.create(
            <AdvertTile data={mockDataAdvert} isDataLoading={false} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders nothing when data is loading', () => {
        render(<AdvertTile data={undefined} isDataLoading={true} />);
        expect(screen.queryByTestId('advert-tile')).toBeNull();
    });
});
