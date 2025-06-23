import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import TileContainer from '../TileContainer';

describe('<TileContainer />', () => {
  const singleChild = <div>Div as children</div>;
  const multipleChildren = (
    <>
      <div>First child</div>
      <div>Second child</div>
    </>
  );

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <>
          <TileContainer>{singleChild}</TileContainer>
          <TileContainer className="custom-class">{singleChild}</TileContainer>
          <TileContainer>{multipleChildren}</TileContainer>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the single child correctly', () => {
    const tree = renderer
      .create(<TileContainer>{singleChild}</TileContainer>)
      .toJSON() as ReactTestRendererJSON;
    const singleDivChild = tree.children?.find(
      (child) =>
        typeof child === 'object' &&
        child.type === 'div' &&
        child.children?.includes('Div as children')
    ) as ReactTestRendererJSON;

    expect(singleDivChild).not.toBeNull();
    expect(singleDivChild.type).toBe('div');
    expect(singleDivChild.children).toContain('Div as children');
  });

  it('renders multiple children correctly', () => {
    const tree = renderer
      .create(<TileContainer>{multipleChildren}</TileContainer>)
      .toJSON() as ReactTestRendererJSON;
    const multipleDivsChild = tree.children?.filter(
      (child) => typeof child === 'object' && child.type === 'div'
    ) as ReactTestRendererJSON[];

    expect(multipleDivsChild).toHaveLength(2);

    const firstChild = multipleDivsChild[0];
    const secondChild = multipleDivsChild[1];

    expect(firstChild.children).toContain('First child');
    expect(secondChild.children).toContain('Second child');
  });

  it('applies the default classes', () => {
    const tree = renderer
      .create(<TileContainer>{singleChild}</TileContainer>)
      .toJSON() as ReactTestRendererJSON;
    expect(tree.type).toBe('div');
    expect(tree.props.className).toContain('flex');
    expect(tree.props.className).toContain('bg-container_grey');
    expect(tree.props.className).toContain('rounded-3xl');
  });

  it('applies the custom class', () => {
    const customClass = 'custom-class';
    const tree = renderer
      .create(
        <TileContainer className={customClass}>{singleChild}</TileContainer>
      )
      .toJSON() as ReactTestRendererJSON;
    expect(tree.props.className).toContain('flex');
    expect(tree.props.className).toContain('bg-container_grey');
    expect(tree.props.className).toContain('rounded-3xl');
    expect(tree.props.className).toContain(customClass);
  });
});
