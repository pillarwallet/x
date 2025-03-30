import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import Body from '../Body';

describe('<Body />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <>
          <Body>Some regular text.</Body>
          <Body className="text-red-500">Some red text</Body>
          <Body className="text-[23px]">Some text with font size 23px</Body>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];

    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('Some regular text.');
    expect(treeElements[0].type).toBe('p');
    expect(treeElements[0].props.className).toContain('text-base');
    expect(treeElements[0].props.className).toContain('font-medium');
    expect(treeElements[1].props.className).toContain('text-red-500');
    expect(treeElements[2].props.className).toContain('text-[23px]');
  });
});
