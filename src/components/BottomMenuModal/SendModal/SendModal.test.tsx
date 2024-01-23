import React from 'react';
import { render, RenderResult, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import * as TransactionKit from '@etherspot/transaction-kit';
import { ethers } from 'ethers';

// components
import SendModal from './';

// theme
import { defaultTheme } from '../../../theme';

// providers
import BottomMenuModalProvider from '../../../providers/BottomMenuModalProvider';
import LanguageProvider from '../../../providers/LanguageProvider';

const ethersProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 'goerli'); // replace with your node's RPC URL
const provider = ethers.Wallet.createRandom().connect(ethersProvider);

const getFormGroupLabel = (formGroup: Element) => {
  return formGroup?.children?.item(0) as Element;
}

describe('<BottomMenu />', () => {
  let rendered: RenderResult;
  let formGroup1: Element;
  let formGroup2: Element;
  let formGroup3: Element;
  let formGroup4: Element;
  let bottomActionBar: Element;

  let formGroup1Input: Element;
  let formGroup3Select: Element;
  let formGroup4Input: Element;
  let submitButton: Element;

  beforeEach(async () => {
    await act(async () => {
      rendered = render(
        <BrowserRouter>
          <TransactionKit.EtherspotTransactionKit provider={provider}>
            <ThemeProvider theme={defaultTheme}>
              <LanguageProvider>
                <BottomMenuModalProvider>
                  <SendModal />
                </BottomMenuModalProvider>
              </LanguageProvider>
            </ThemeProvider>
          </TransactionKit.EtherspotTransactionKit>
        </BrowserRouter>
      );
    });

    const wrapper = rendered.container.children?.item(0);

    formGroup1 = wrapper?.children?.item(0) as Element;
    formGroup2 = wrapper?.children?.item(1) as Element;
    formGroup3 = wrapper?.children?.item(2) as Element;
    formGroup4 = wrapper?.children?.item(3) as Element;
    bottomActionBar = wrapper?.children?.item(4) as Element;

    formGroup1Input = (formGroup1?.children?.item(1) as Element)?.children?.item(0) as Element;
    formGroup3Select = formGroup3?.children?.item(1) as Element;
    formGroup4Input = (formGroup4?.children?.item(1) as Element)?.children?.item(0) as Element;
    submitButton = bottomActionBar?.children?.item(0) as Element;
  });

  it('renders correctly', () => {
    expect(rendered.asFragment()).toMatchSnapshot();

    // address input
    expect(getFormGroupLabel(formGroup1).tagName).toBe('LABEL');
    expect(formGroup1Input.tagName).toBe('INPUT');
    expect(formGroup1Input).toHaveAttribute('type', 'text');

    // divider
    expect(formGroup2.children.item(0)?.tagName).toBe('DIV');

    // asset select
    expect(getFormGroupLabel(formGroup3).tagName).toBe('LABEL');
    expect(formGroup3Select.children.length).toBe(4); // eth + 3 tokens

    // asset amount input
    expect(getFormGroupLabel(formGroup4).tagName).toBe('LABEL');
    expect(formGroup4Input.tagName).toBe('INPUT');
    expect(formGroup4Input).toHaveAttribute('type', 'text');
    expect(formGroup4Input).toBeDisabled();

    // submit button
    expect(submitButton.tagName).toBe('BUTTON');
    expect(submitButton).toBeDisabled();
  });

  it('allows to send on valid values', async () => {
    const user = userEvent.setup();

    // address input
    await user.type(formGroup1Input, '0x7F30B1960D5556929B03a0339814fE903c55a347');
    expect(formGroup1Input).toHaveValue('0x7F30B1960D5556929B03a0339814fE903c55a347');

    // asset select
    await user.click(formGroup3Select.children.item(2) as Element); // click TK2

    // asset amount input
    expect(formGroup4Input).not.toBeDisabled();
    await user.type(formGroup4Input, '1.234');
    expect(formGroup4Input).toHaveValue('1.234');

    // submit button
    expect(submitButton.tagName).toBe('BUTTON');
    expect(submitButton).not.toBeDisabled();

    // match valid inputs snapshot
    expect(rendered.asFragment()).toMatchSnapshot();
  });

  it('renders message on successful send', async () => {
    const user = userEvent.setup();

    // address input
    await user.type(formGroup1Input, '0x7F30B1960D5556929B03a0339814fE903c55a347');

    // asset select
    await user.click(formGroup3Select.children.item(2) as Element); // click TK2

    // asset amount input
    await user.type(formGroup4Input, '1.234');

    // submit button
    await user.click(submitButton); // click send

    // match successful send snapshot
    expect(rendered.asFragment()).toMatchSnapshot();

    const wrapper = rendered.container.children?.item(0);
    expect(wrapper?.children?.item(0)?.innerHTML).toBe('Sent!');
  });

  it('renders error on failed send', async () => {
    const failedSendErrorMessage = 'Failed to send!';

    jest.spyOn(TransactionKit, 'useEtherspotTransactions').mockReturnValue(({
      chainId: 1,
      batches: [],
      estimate: async () => [],
      send: async () => [{ sentBatches: [{ errorMessage: failedSendErrorMessage }], estimatedBatches: [], batches: [] }],
    }));

    const user = userEvent.setup();

    // address input
    await user.type(formGroup1Input, '0x7F30B1960D5556929B03a0339814fE903c55a347');

    // asset select
    await user.click(formGroup3Select.children.item(2) as Element); // click TK2

    // asset amount input
    await user.type(formGroup4Input, '1.234');

    // submit button
    await user.click(submitButton); // click send

    // match failed send snapshot
    expect(rendered.asFragment()).toMatchSnapshot();

    const errorMessage = bottomActionBar.children?.item(1);
    expect(errorMessage?.innerHTML).toBe(failedSendErrorMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
    rendered.unmount();
  });
});


