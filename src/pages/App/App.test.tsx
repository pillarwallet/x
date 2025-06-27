import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import renderer, {
  ReactTestRenderer,
  ReactTestRendererJSON,
  act,
} from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

// types
import type { Mock } from 'vitest';

// theme
import { defaultTheme } from '../../theme';

// providers
import AllowedAppsProvider from '../../providers/AllowedAppsProvider';
import LanguageProvider from '../../providers/LanguageProvider';

// navigation
import { AuthorizedNavigation } from '../../navigation';

describe.skip('<App />', () => {
  it('shows not found if app identifier is not within allowed apps', async () => {
    let rendered: ReactTestRenderer | undefined;

    await act(async () => {
      rendered = renderer.create(
        <MemoryRouter initialEntries={['/what-the-fook-unknown-app-69420']}>
          <ThemeProvider theme={defaultTheme}>
            <AllowedAppsProvider>
              <LanguageProvider>
                <AuthorizedNavigation />
              </LanguageProvider>
            </AllowedAppsProvider>
          </ThemeProvider>
        </MemoryRouter>
      );
    });

    expect(rendered).toBeDefined();

    const tree = (rendered as ReactTestRenderer).toJSON();

    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement.children?.length).toBe(1);
    expect((treeElement?.children?.[0] as ReactTestRendererJSON)?.type).toBe(
      'p'
    );
    expect(
      (treeElement.children?.[0] as ReactTestRendererJSON)?.children?.[1]
    ).toBe('Page not found');
  });

  it('successfully loads app by identifier', async () => {
    (axios.get as Mock).mockImplementation(() =>
      Promise.resolve({ data: { apps: [{ id: 'sign-message' }] } })
    );

    let rendered: ReactTestRenderer | undefined;

    await act(async () => {
      rendered = renderer.create(
        <MemoryRouter initialEntries={['/sign-message']}>
          <ThemeProvider theme={defaultTheme}>
            <AllowedAppsProvider>
              <LanguageProvider>
                <AuthorizedNavigation />
              </LanguageProvider>
            </AllowedAppsProvider>
          </ThemeProvider>
        </MemoryRouter>
      );
      // there's artificial 1s timeout for app loading screen, lets add it here as well
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });
    });

    expect(rendered).toBeDefined();

    const tree = (rendered as ReactTestRenderer).toJSON();

    expect(tree).toMatchSnapshot();

    const mainWrapperElement = tree as ReactTestRendererJSON;
    const treeElements = mainWrapperElement.children as ReactTestRendererJSON[];

    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].type).toBe('h1');
    expect(treeElements[0].children?.[0]).toBe('Sign Message');
    expect(treeElements[1].type).toBe('textarea');
    expect(treeElements[2].children?.length).toBe(1);
    expect(treeElements[2].type).toBe('button');
    expect(treeElements[2].children?.[0]).toBe('Sign Message');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
