import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

// components
import Button from './';

// theme
import { defaultTheme } from '../../theme';

describe('<Button />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={defaultTheme}>
          <Button>Some regular text.</Button>
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement.children?.length).toBe(1);
    expect(treeElement.children?.[0]).toBe('Some regular text.');
    expect(treeElement.type).toBe('button');
    expect(treeElement).toHaveStyleRule('color', defaultTheme.color.text.buttonPrimary);
  });
});
