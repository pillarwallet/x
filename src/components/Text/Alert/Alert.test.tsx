import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

// components
import Alert from './';

// theme
import { defaultTheme } from '../../../theme';

describe('<Alert />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={defaultTheme}>
          <Alert>default</Alert>
          <Alert level="info">info</Alert>
          <Alert level="warning">warning</Alert>
          <Alert level="success">success</Alert>
          <Alert level="error">error</Alert>
          {/* @ts-expect-error: pass wrong level for test purpose */}
          <Alert level="non-exsisting">non-existing</Alert>
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];
    expect(treeElements[0].children?.length).toBe(1);
    expect(treeElements[0].children?.[0]).toBe('default');
    expect(treeElements[0].type).toBe('p');
    expect(treeElements[0]).toHaveStyleRule('color', defaultTheme.color.text.info);
    expect(treeElements[0]).toHaveStyleRule('background', defaultTheme.color.background.info);
    expect(treeElements[1]).toHaveStyleRule('color', defaultTheme.color.text.info);
    expect(treeElements[1]).toHaveStyleRule('background', defaultTheme.color.background.info);
    expect(treeElements[2]).toHaveStyleRule('color', defaultTheme.color.text.warning);
    expect(treeElements[2]).toHaveStyleRule('background', defaultTheme.color.background.warning);
    expect(treeElements[3]).toHaveStyleRule('color', defaultTheme.color.text.success);
    expect(treeElements[3]).toHaveStyleRule('background', defaultTheme.color.background.success);
    expect(treeElements[4]).toHaveStyleRule('color', defaultTheme.color.text.error);
    expect(treeElements[4]).toHaveStyleRule('background', defaultTheme.color.background.error);
    expect(treeElements[5]).toHaveStyleRule('color', undefined);
    expect(treeElements[5]).toHaveStyleRule('background', undefined);
  });
});

