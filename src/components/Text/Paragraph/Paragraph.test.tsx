import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import Paragraph from './';

describe('<Paragraph />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <>
          <Paragraph>Some regular text.</Paragraph>
          <Paragraph center>centered</Paragraph>
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];
    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('Some regular text.');
    expect(treeElements[0].type).toBe('p');
    expect(treeElements[0]).not.toHaveStyleRule('text-align', 'center');
    expect(treeElements[1]).toHaveStyleRule('text-align', 'center');
  });
});

