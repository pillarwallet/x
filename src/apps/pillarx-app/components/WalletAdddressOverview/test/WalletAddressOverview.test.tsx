import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import WalletAddressOverview from '../WalletAddressOverview';

describe('<WalletAddressOverview />', () => {
  const address = '0x1234567890';
  const mockSetIsCopied = jest.fn();
  const mockUseState = jest.spyOn(React, 'useState');

  beforeEach(() => {
    mockUseState.mockReturnValue([false, mockSetIsCopied]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<WalletAddressOverview address={address} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct icon and address', () => {
    const tree = renderer
      .create(<WalletAddressOverview address={address} />)
      .toJSON() as ReactTestRendererJSON;

    const profileIcon = tree.children?.find(
      (child) =>
        typeof child === 'object' &&
        child.props.className === 'bg-medium_grey p-2.5 rounded-full w-10 h-10'
    ) as ReactTestRendererJSON;

    const addressText = tree.children?.find(
      (child) =>
        typeof child === 'object' &&
        child.props.children ===
          `${address.substring(0, 6)}...${address.substring(address.length - 5)}`
    ) as ReactTestRendererJSON;

    expect(profileIcon).not.toBeNull();
    expect(addressText).not.toBeNull();
  });
});
