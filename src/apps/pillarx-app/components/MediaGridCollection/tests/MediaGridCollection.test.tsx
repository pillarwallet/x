/* eslint-disable react/jsx-props-no-spreading */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import MediaGridCollection from '../MediaGridCollection';

describe('<MediaGridCollection />', () => {
  const mockGridData = {
    image_url: 'collection-image.png',
    opensea_url: 'https://opensea.io/collection',
    name: 'Collection Name',
    items: [
      {
        imageUrl: 'item-image-1.png',
        url: 'https://item1.com',
      },
      {
        imageUrl: 'item-image-2.png',
        url: 'https://item2.com',
      },
      {
        imageUrl: 'item-image-3.png',
        url: 'https://item3.com',
      },
      {
        imageUrl: 'item-image-4.png',
        url: 'https://item4.com',
      },
    ],
  };

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<MediaGridCollection gridData={mockGridData} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders collection images and text correctly', () => {
    render(<MediaGridCollection gridData={mockGridData} />);

    const images = screen.getAllByTestId('display-collection-image');
    expect(images).toHaveLength(5); // 4 item images + 1 collection image

    const bodyText = screen.getByText('Collection Name');
    expect(bodyText).toBeInTheDocument();
  });

  it('renders null if gridData.items is not present', () => {
    render(
      <MediaGridCollection
        gridData={{
          image_url: 'collection-image.png',
          opensea_url: 'https://opensea.io/collection',
          name: 'Collection Name',
        }}
      />
    );
    expect(
      screen.queryByTestId('media-grid-collection')
    ).not.toBeInTheDocument();
  });
});
