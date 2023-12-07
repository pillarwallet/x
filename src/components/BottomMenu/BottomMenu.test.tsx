import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

// components
import BottomMenu from './';

// theme
import { defaultTheme } from '../../theme';

describe('<BottomMenu />', () => {
  it('renders correctly', () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: true }));
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={defaultTheme}>
            <BottomMenu />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect((treeElement.children?.[0] as ReactTestRendererJSON)?.children?.length).toBe(1); // menu home button
    expect((treeElement.children?.[1] as ReactTestRendererJSON)?.children?.length).toBe(4); // other menu items
    expect(treeElement.type).toBe('div');
    expect(treeElement?.children?.[0]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);
    expect(treeElement?.children?.[1]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);
    jest.clearAllMocks();
  });

  it('renders correctly if not authenticated', () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: false }));
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={defaultTheme}>
            <BottomMenu />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement).toBe(null);
    jest.clearAllMocks();
  });
});

jest.clearAllMocks();


