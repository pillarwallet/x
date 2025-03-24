import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import LeaderboardTabsButton from '../LeaderboardTabsButton';

describe('<LeaderboardTabsButton />', () => {
  const mockTabs = ['Weekly', 'All time'];
  const mockOnTabClick = jest.fn();

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <LeaderboardTabsButton
          tabs={mockTabs}
          activeTab={0}
          onTabClick={mockOnTabClick}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders all tabs', () => {
    render(
      <LeaderboardTabsButton
        tabs={mockTabs}
        activeTab={0}
        onTabClick={mockOnTabClick}
      />
    );
    mockTabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it('applies active class to the correct tab', () => {
    render(
      <LeaderboardTabsButton
        tabs={mockTabs}
        activeTab={1}
        onTabClick={mockOnTabClick}
      />
    );
    const activeTab = screen.getByText(mockTabs[1]).closest('button');
    expect(activeTab).toHaveClass('bg-purple_medium');
  });

  it('calls onTabClick when a tab is clicked', () => {
    render(
      <LeaderboardTabsButton
        tabs={mockTabs}
        activeTab={0}
        onTabClick={mockOnTabClick}
      />
    );
    const tabButton = screen.getByText(mockTabs[1]);
    fireEvent.click(tabButton);
    expect(mockOnTabClick).toHaveBeenCalledWith(1);
  });

  it('changes active tab when clicked', () => {
    render(
      <LeaderboardTabsButton
        tabs={mockTabs}
        activeTab={1}
        onTabClick={mockOnTabClick}
      />
    );
    fireEvent.click(screen.getByText(mockTabs[0]));
    expect(mockOnTabClick).toHaveBeenCalledWith(0);
  });
});
