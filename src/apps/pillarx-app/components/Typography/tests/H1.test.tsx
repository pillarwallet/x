import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import H1 from '../H1';

describe('<H1 />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <>
          <H1>Some big heading text.</H1>
          <H1 className="text-red-500">Some red heading red text</H1>
          <H1 className="text-[120px]">Some heading with font size 120px</H1>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];

    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('Some big heading text.');
    expect(treeElements[0].type).toBe('h1');
    expect(treeElements[0].props.className).toContain('text-3xl');
    expect(treeElements[0].props.className).toContain('font-medium');
    expect(treeElements[1].props.className).toContain('text-red-500');
    expect(treeElements[2].props.className).toContain('text-[120px]');
  });
});
