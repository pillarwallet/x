/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { ApiLayout, Projection } from '../../../../../types/api';
import HighlightedMediaGridTile from '../HighlightedMediaGridTile';

// Mock useRefDimensions
jest.mock('../../../hooks/useRefDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 1200 })),
}));

describe('<HighlightedMediaGridTile />', () => {
  const mockData: Projection = {
    data: {
      grids: [
        {
          collection: 'Collection 1',
          name: 'Grid 1',
          description: 'Description 1',
          image_url: 'image1.png',
          opensea_url: 'https://opensea.io/collection/1',
          project_url: 'https://project1.com',
          items: [
            {
              collection: 'Item Collection 1',
              description: 'Item Description 1',
              imageUrl: 'item1.png',
              name: 'Item 1',
              url: 'https://item1.com',
            },
          ],
        },
      ],
    },
    meta: {
      display: {
        title: 'Title',
      },
    },
    layout: ApiLayout.MEDIA_GRID_HIGHLIGHTED,
    id: '123',
  };

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <HighlightedMediaGridTile data={mockData} isDataLoading={false} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders media grid collections when data is available', () => {
    render(<HighlightedMediaGridTile data={mockData} isDataLoading={false} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getAllByTestId('media-grid-collection')).toHaveLength(1);
  });

  it('renders no content when data is not available and not loading', () => {
    render(<HighlightedMediaGridTile data={undefined} isDataLoading={false} />);
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('media-grid-collection')).toHaveLength(0);
  });
});
