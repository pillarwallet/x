/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import DisplayCollectionImage from '../DisplayCollectionImage';

describe('<DisplayCollectionImage />', () => {
  const openMock = jest.fn();

  beforeAll(() => {
    global.open = openMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot with image', () => {
    const tree = renderer
      .create(
        <DisplayCollectionImage image="test-image.png" className="test-class" />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot without image', () => {
    const tree = renderer
      .create(<DisplayCollectionImage className="test-class" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders image with correct attributes and handles click', () => {
    render(
      <DisplayCollectionImage
        image="test-image.png"
        className="test-class"
        url="https://example.com"
      />
    );

    const img = screen.getByTestId('display-collection-image');

    fireEvent.click(img);
    expect(openMock).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noreferrer'
    );
  });

  it('renders Avatar when no image is provided and handles click', () => {
    render(
      <DisplayCollectionImage
        className="test-class"
        url="https://example.com"
      />
    );

    const avatar = screen.getByTestId('random-avatar');
    expect(avatar).toBeInTheDocument();

    const div = screen.getByTestId('display-collection-image');
    expect(div).toBeInTheDocument();

    fireEvent.click(div);

    expect(openMock).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noreferrer'
    );
  });

  it('does not render cursor-pointer class when no url is provided', () => {
    render(
      <DisplayCollectionImage className="test-class" image="test-image.png" />
    );

    const img = screen.getByTestId('display-collection-image');
    expect(img).toBeInTheDocument();
    expect(img).not.toHaveClass('cursor-pointer');
  });
});
