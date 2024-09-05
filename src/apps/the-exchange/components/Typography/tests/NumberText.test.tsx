import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import NumberText from '../NumberText';

describe('<NumberText />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <>
          <NumberText>Some number text.</NumberText>
          <NumberText className="text-red-500">
            Some red heading red text
          </NumberText>
          <NumberText className="text-[120px]">
            Some heading with font size 120px
          </NumberText>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];

    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('Some number text.');
    expect(treeElements[0].type).toBe('h1');
    expect(treeElements[0].props.className).toContain('text-black_grey');
    expect(treeElements[1].props.className).toContain('text-red-500');
    expect(treeElements[2].props.className).toContain('text-[120px]');
  });
});
