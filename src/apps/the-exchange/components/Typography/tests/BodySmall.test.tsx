import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import BodySmall from '../BodySmall';

describe('<BodySmall />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <>
          <BodySmall>Some small text.</BodySmall>
          <BodySmall className="text-red-500">Some red small text</BodySmall>
          <BodySmall className="text-[7px]">
            Some small text with font size 7px
          </BodySmall>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];

    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('Some small text.');
    expect(treeElements[0].type).toBe('p');
    expect(treeElements[0].props.className).toContain('text-xs');
    expect(treeElements[0].props.className).toContain('font-normal');
    expect(treeElements[1].props.className).toContain('text-red-500');
    expect(treeElements[2].props.className).toContain('text-[7px]');
  });
});
