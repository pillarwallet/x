import { render, screen } from '@testing-library/react';
import moment from 'moment';
import renderer from 'react-test-renderer';

// types
import {
  ApiLayout,
  EditorialDisplay,
  Projection,
} from '../../../../../types/api';

// components
import EditorialTile from '../EditorialTile';

describe('<EditorialTile />', () => {
  const mockDataEditorial: Projection = {
    meta: {
      display: {
        title: 'Editorial title',
        summary: 'Editorial summary',
        media: 'https://example.com/media-image.png',
        tags: [
          { label: 'Tag1', color: 'blue', icon: 'icon1.png' },
          { label: 'Tag2', color: 'green', icon: 'icon2.png' },
        ],
        attribution: {
          name: 'Youtube',
          href: 'https://youtube.com',
          icon: 'https://example.com/youtube.png',
        },
        timestamp: 1633046400,
      },
    },
    data: undefined,
    layout: ApiLayout.EDITORIAL,
    id: 'editorial',
  };

  const mockEditorialDisplay = mockDataEditorial.meta
    .display as EditorialDisplay;

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<EditorialTile data={mockDataEditorial} isDataLoading={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders skeleton loader when data is loading', () => {
    render(<EditorialTile data={undefined} isDataLoading />);

    expect(screen.getByTestId('editorial-tile-loading')).toBeInTheDocument();
  });

  it('renders correctly with all the given data', () => {
    render(<EditorialTile data={mockDataEditorial} isDataLoading={false} />);

    expect(screen.getByText('Editorial title')).toBeInTheDocument();
    expect(screen.getByText('Editorial summary')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
    expect(screen.getByText('Youtube')).toBeInTheDocument();
    expect(
      screen.getByText(
        moment(
          new Date((mockEditorialDisplay.timestamp as number) * 1000)
        ).format('D MMMM YYYY')
      )
    ).toBeInTheDocument();
  });

  it('renders image media correctly', () => {
    render(<EditorialTile data={mockDataEditorial} isDataLoading={false} />);

    const img = screen.getByTestId('editorial-tile-image');
    const video = screen.queryByTestId('editorial-tile-video');
    const audio = screen.queryByTestId('editorial-tile-audio');

    expect(img).toHaveAttribute('src', 'https://example.com/media-image.png');
    expect(video).not.toBeInTheDocument();
    expect(audio).not.toBeInTheDocument();
  });

  it('renders video media correctly', () => {
    const mockDataWithVideo = {
      ...mockDataEditorial,
      meta: {
        ...mockDataEditorial.meta,
        display: {
          ...mockDataEditorial.meta.display,
          media: 'https://example.com/media-video.mp4',
        },
      },
    };

    render(<EditorialTile data={mockDataWithVideo} isDataLoading={false} />);

    const img = screen.queryByTestId('editorial-tile-image');
    const video = screen.getByTestId('editorial-tile-video');
    const audio = screen.queryByTestId('editorial-tile-audio');

    expect(video).toBeInTheDocument();
    expect(img).not.toBeInTheDocument();
    expect(audio).not.toBeInTheDocument();
  });

  it('renders audio media correctly', () => {
    const mockDataWithAudio = {
      ...mockDataEditorial,
      meta: {
        ...mockDataEditorial.meta,
        display: {
          ...mockDataEditorial.meta.display,
          media: 'https://example.com/media-audio.mp3',
        },
      },
    };

    render(<EditorialTile data={mockDataWithAudio} isDataLoading={false} />);

    const img = screen.queryByTestId('editorial-tile-image');
    const video = screen.queryByTestId('editorial-tile-video');
    const audio = screen.getByTestId('editorial-tile-audio');

    expect(audio).toBeInTheDocument();
    expect(video).not.toBeInTheDocument();
    expect(img).not.toBeInTheDocument();
  });

  it('does not render media when not provided', () => {
    const mockDataWithoutMedia = {
      ...mockDataEditorial,
      meta: {
        ...mockDataEditorial.meta,
        display: {
          ...mockDataEditorial.meta.display,
          media: undefined,
        },
      },
    };

    render(<EditorialTile data={mockDataWithoutMedia} isDataLoading={false} />);

    const img = screen.queryByTestId('editorial-tile-image');
    const video = screen.queryByTestId('editorial-tile-video');
    const audio = screen.queryByTestId('editorial-tile-audio');

    expect(img).not.toBeInTheDocument();
    expect(video).not.toBeInTheDocument();
    expect(audio).not.toBeInTheDocument();
  });

  it('does not render the attribution if not provided', () => {
    const mockDataWithoutAttribution = {
      ...mockDataEditorial,
      meta: {
        ...mockDataEditorial.meta,
        display: {
          ...mockDataEditorial.meta.display,
          attribution: undefined,
        },
      },
    };

    render(
      <EditorialTile data={mockDataWithoutAttribution} isDataLoading={false} />
    );

    expect(screen.queryByText('Youtube')).toBeNull();
  });

  it('handles invalid media data', () => {
    const invalidMediaData = {
      ...mockDataEditorial,
      meta: {
        ...mockDataEditorial.meta,
        display: {
          ...mockDataEditorial.meta.display,
          media: 'invalid-url',
        },
      },
    };

    render(<EditorialTile data={invalidMediaData} isDataLoading={false} />);
    const img = screen.queryByTestId('editorial-tile-image');
    const video = screen.queryByTestId('editorial-tile-video');
    const audio = screen.queryByTestId('editorial-tile-audio');

    expect(img).not.toBeInTheDocument();
    expect(video).not.toBeInTheDocument();
    expect(audio).not.toBeInTheDocument();
  });
});
