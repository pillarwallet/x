import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import TriangleRedIcon from '../../../images/triangle-down-red.svg';
import TriangleGreenIcon from '../../../images/triangle-up-green.svg';
import TokensPercentage from '../TokensPercentage';

describe('<TokensPercentage />', () => {
  const percentage = 12.34;

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<TokensPercentage percentage={percentage} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the correct icon and number for positive percentage', () => {
    const tree = renderer
      .create(<TokensPercentage percentage={percentage} />)
      .toJSON() as ReactTestRendererJSON;

    const percentageIcon = tree.children?.find(
      (child) => typeof child === 'object' && child.type === 'img'
    ) as ReactTestRendererJSON;

    const percentageText = tree.children?.find(
      (child) => typeof child === 'object' && child.type === 'p'
    ) as ReactTestRendererJSON;

    expect(percentageIcon).not.toBeNull();
    expect(percentageIcon.props.src).toBe(TriangleGreenIcon);

    expect(percentageText).not.toBeNull();
    expect(percentageText?.children?.[0]).toBe('12.34');
    expect(percentageText.props.className).toContain('text-percentage_green');
  });

  it('renders the correct icon and number for negative percentage', () => {
    const tree = renderer
      .create(<TokensPercentage percentage={-percentage} />)
      .toJSON() as ReactTestRendererJSON;

    const percentageIcon =
      (tree.children?.find(
        (child) => typeof child === 'object' && child.type === 'img'
      ) as ReactTestRendererJSON) || null;

    const percentageText =
      (tree.children?.find(
        (child) => typeof child === 'object' && child.type === 'p'
      ) as ReactTestRendererJSON) || null;

    expect(percentageIcon).not.toBeNull();
    expect(percentageIcon.props.src).toBe(TriangleRedIcon);

    expect(percentageText).not.toBeNull();
    expect(percentageText?.children?.[0]).toBe('-12.34');
    expect(percentageText.props.className).toContain('text-percentage_red');
  });

  it('returns null when percentage is not provided', () => {
    const tree = renderer.create(<TokensPercentage />).toJSON();
    expect(tree).toBeNull();
  });

  it('returns null when percentage is null', () => {
    const tree = renderer
      .create(<TokensPercentage percentage={null} />)
      .toJSON();
    expect(tree).toBeNull();
  });
});
