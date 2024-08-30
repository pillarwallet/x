import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import {
    setIsSelectChainDropdownOpen,
    setSelectedChain,
} from '../../../reducer/tokenAtlasSlice';

// components
import SelectChainDropdown from '../SelectChainDropdown';

const mockOptions = [1, 2, 3];

describe('<SelectChainDropdown />', () => {
    beforeEach(() => {
        store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
        store.dispatch(setIsSelectChainDropdownOpen(false));
    });

    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <SelectChainDropdown options={mockOptions} />
                </Provider>
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('toggles dropdown visibility on button click', () => {
        render(
            <Provider store={store}>
                <SelectChainDropdown options={mockOptions} />
            </Provider>
        );

        // Initially dropdown should be closed
        expect(screen.queryByRole('list')).not.toBeInTheDocument();

        // Click to open dropdown
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('list')).toBeInTheDocument();

        // Click to close dropdown
        fireEvent.click(screen.getByRole('button'));
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('displays the correct chain name when an option is selected', () => {
        render(
            <Provider store={store}>
                <SelectChainDropdown options={mockOptions} />
            </Provider>
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole('button'));

        // Select the first chain option
        fireEvent.click(screen.getByText('1'));

        // Check if the selected chain is displayed correctly
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(store.getState().tokenAtlas.selectedChain.chainId).toBe(1);
    });

    it('closes the dropdown when an option is selected', () => {
        render(
            <Provider store={store}>
                <SelectChainDropdown options={mockOptions} />
            </Provider>
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('list')).toBeInTheDocument();

        // Select an option
        fireEvent.click(screen.getByText('1'));

        // Dropdown should be closed
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('displays the correct number of options including "all"', () => {
        render(
            <Provider store={store}>
                <SelectChainDropdown options={mockOptions} />
            </Provider>
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole('button'));

        // Check if the dropdown contains all options including "all"
        const options = screen.getAllByRole('listitem');
        expect(options).toHaveLength(mockOptions.length + 1);
        expect(screen.getByText('all')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
