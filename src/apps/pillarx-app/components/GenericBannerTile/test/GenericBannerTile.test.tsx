import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { ApiLayout, Projection } from '../../../../../types/api';

// components
import GenericBannerTile from '../GenericBannerTile';

describe('<GenericBannerTile />', () => {
  const mockDataGenericBanner: Projection = {
    meta: {
      display: {
        title: 'Banner title',
        subtitle: 'Banner subtitle',
        backgroundImage: 'https://example.com/background-image.png',
        cta: {
          text: 'This is the button text',
          href: 'https://example.com',
        },
      },
    },
    data: undefined,
    layout: ApiLayout.GENERIC_BANNER,
    id: 'genericBanner',
  };

  const mockDataGenericBannerWithoutCTA = {
    meta: {
      display: {
        title: 'Banner title',
        subtitle: 'Banner subtitle',
        backgroundImage: 'https://example.com/background-image.png',
        cta: {
          text: 'This is the button text',
          href: undefined,
        },
      },
    },
    data: undefined,
    layout: ApiLayout.GENERIC_BANNER,
    id: 'genericBanner',
  };

  const mockDataGenericBannerWithoutCTATwo = {
    meta: {
      display: {
        title: 'Banner title',
        subtitle: 'Banner subtitle',
        backgroundImage: 'https://example.com/background-image.png',
        cta: {
          text: undefined,
          href: 'https://example.com',
        },
      },
    },
    data: undefined,
    layout: ApiLayout.GENERIC_BANNER,
    id: 'genericBanner',
  };

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <GenericBannerTile data={mockDataGenericBanner} isDataLoading={false} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with all the given data', () => {
    render(
      <GenericBannerTile data={mockDataGenericBanner} isDataLoading={false} />
    );

    expect(screen.getByText('Banner title')).toBeInTheDocument();
    expect(screen.getByText('Banner subtitle')).toBeInTheDocument();
    expect(screen.getByText('This is the button text')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls window.open when button is clicked', () => {
    window.open = jest.fn();

    render(
      <GenericBannerTile data={mockDataGenericBanner} isDataLoading={false} />
    );
    fireEvent.click(screen.getByText('This is the button text'));

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
  });

  it('does not render the button if href is missing', () => {
    render(
      <GenericBannerTile
        data={mockDataGenericBannerWithoutCTA}
        isDataLoading={false}
      />
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does not render the button if text is missing', () => {
    render(
      <GenericBannerTile
        data={mockDataGenericBannerWithoutCTATwo}
        isDataLoading={false}
      />
    );

    expect(screen.queryByRole('button')).toBeNull();
  });
});
