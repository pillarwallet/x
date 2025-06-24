import { act, render, RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

// components
import Select from '.';

// theme
import { defaultTheme } from '../../../theme';

// types
import { SelectOption } from '../../../types';

const testOptions: SelectOption[] = [
  {
    id: '1',
    title: 'test 1',
    value: 'test1',
  },
  {
    id: '2',
    title: 'test 2',
    value: 'test2',
  },
  {
    id: '3',
    title: 'test 3',
    value: 'test3',
    imageSrc: 'https://via.placeholder.com/150',
  },
];

describe('<Select />', () => {
  let rendered: RenderResult;

  it('renders correctly with no options', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={[]} onChange={() => {}} />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with some options', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={testOptions} onChange={() => {}} />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    expect(select.children?.length).toBe(testOptions.length); // none selected, all list shown
  });

  it('responds once clicked', async () => {
    const user = userEvent.setup();

    const onChange = jest.fn();

    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={testOptions} onChange={onChange} />
        </ThemeProvider>
      );
    });

    const select = rendered.container.children?.item(0) as Element;
    const option2 = select.children?.item(1) as Element;
    await user.click(option2);

    expect(rendered.asFragment()).toMatchSnapshot();

    expect(select.children?.length).toBe(1); // only selected shown
    expect(onChange).toBeCalledWith(expect.objectContaining(testOptions[1]));
  });

  it('renders correctly with default option', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select
            options={testOptions}
            onChange={() => {}}
            defaultSelectedId={testOptions[1].id}
          />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    expect(select.children?.length).toBe(1); // only selected shown

    const valueElement = rendered.getByText(testOptions[1].value);
    expect(valueElement).toBeInTheDocument();
  });

  it('shows loading skeleton when options loading', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={testOptions} isLoadingOptions onChange={() => {}} />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    expect(select.children?.length).toBe(2); // loading skeleton left&right components shown

    const animationLeft = select.children.item(0);
    const animationRight = select.children.item(1);
    const animationMatch = expect.stringContaining('1s linear infinite');
    expect(animationLeft?.children.item(0)).toHaveStyleRule(
      'animation',
      animationMatch
    );
    expect(animationRight?.children.item(0)).toHaveStyleRule(
      'animation',
      animationMatch
    );
  });

  it('shows loading skeleton on option item where option value is loading', async () => {
    const testOptionsWithLoadingValue = testOptions.map((option, index) => ({
      ...option,
      isLoadingValue: index === 1, // 2nd option value is loading
    }));

    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={testOptionsWithLoadingValue} onChange={() => {}} />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    expect(select.children?.length).toBe(3);

    const secondOption = select.children?.item(1) as Element;
    const skeletonInSecondOption = secondOption.querySelector(
      '[data-testid="skeleton-loader-list-item"]'
    );
    expect(skeletonInSecondOption).toBeTruthy();
  });

  it('renders correctly with option image', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select options={testOptions} onChange={() => {}} />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    const thirdOption = select.children?.item(2) as Element;
    const thirdOptionLeft = thirdOption.children?.item(0) as Element;
    const thirdOptionImage = thirdOptionLeft.children?.item(0) as Element;
    expect(thirdOptionImage).toHaveAttribute('src', testOptions[2].imageSrc);
  });

  it('renders correctly with selected option image', async () => {
    await act(async () => {
      rendered = render(
        <ThemeProvider theme={defaultTheme}>
          <Select
            options={testOptions}
            defaultSelectedId={testOptions[2].id}
            onChange={() => {}}
          />
        </ThemeProvider>
      );
    });

    expect(rendered.asFragment()).toMatchSnapshot();

    const select = rendered.container.children?.item(0) as Element;
    const selectedOption = select.children?.item(0) as Element;
    const selectedOptionLeft = selectedOption.children?.item(0) as Element;
    const selectedOptionImage = selectedOptionLeft.children?.item(0) as Element;
    expect(selectedOptionImage).toHaveAttribute('src', testOptions[2].imageSrc);
  });
});
