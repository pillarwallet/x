import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

// components
import BottomMenu from './';

// theme
import { defaultTheme } from '../../theme';

// providers
import BottomMenuModalProvider from '../../providers/BottomMenuModalProvider';
import LanguageProvider from '../../providers/LanguageProvider';

describe('<BottomMenu />', () => {
  it('renders correctly', () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: true }));
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={defaultTheme}>
            <LanguageProvider>
              <BottomMenuModalProvider>
                <BottomMenu />
              </BottomMenuModalProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];
    const [bottomMenuElement] = treeElements;
    expect((bottomMenuElement.children?.[0] as ReactTestRendererJSON)?.children?.length).toBe(1); // menu home button
    expect((bottomMenuElement.children?.[1] as ReactTestRendererJSON)?.children?.length).toBe(4); // other menu items
    expect(bottomMenuElement.type).toBe('div');
    expect(bottomMenuElement?.children?.[0]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);
    expect(bottomMenuElement?.children?.[1]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);
    jest.clearAllMocks();
  });

  it('renders correctly if not authenticated', () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: false }));
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={defaultTheme}>
            <LanguageProvider>
              <BottomMenuModalProvider>
                <BottomMenu />
              </BottomMenuModalProvider>
            </LanguageProvider>
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


