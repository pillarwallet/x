import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

// components
import Button from '.';

// theme
import { defaultTheme } from '../../theme';

describe('<Button />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={defaultTheme}>
          <Button>Some regular text.</Button>
          <Button $fullWidth>full width button</Button>
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();

    const treeElements = tree as ReactTestRendererJSON[];
    expect(treeElements?.length).toBe(2);
    expect(treeElements?.[0]?.children?.length).toBe(1);
    expect(treeElements?.[0]?.children?.[0]).toBe('Some regular text.');
    expect(treeElements?.[0].type).toBe('button');
    expect(treeElements?.[0]).toHaveStyleRule(
      'color',
      defaultTheme.color.text.buttonPrimary
    );
    expect(treeElements?.[0]).not.toHaveStyleRule('width', '100%');
    expect(treeElements?.[1]).toHaveStyleRule('width', '100%');
  });
});
