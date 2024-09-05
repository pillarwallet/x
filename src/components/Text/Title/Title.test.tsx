import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import { PrimaryTitle } from '.';

describe('<PrimaryTitle />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<PrimaryTitle>Some regular text.</PrimaryTitle>)
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement.children?.length).toBe(1);
    expect(treeElement.children?.[0]).toBe('Some regular text.');
    expect(treeElement.type).toBe('h1');
  });
});
