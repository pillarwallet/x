import React from 'react';
import renderer, { ReactTestRendererJSON, act, ReactTestRenderer } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { ethers } from 'ethers';

// components
import BottomMenu from './';

// theme
import { defaultTheme } from '../../theme';

// providers
import BottomMenuModalProvider from '../../providers/BottomMenuModalProvider';
import LanguageProvider from '../../providers/LanguageProvider';

const ethersProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 'goerli'); // replace with your node's RPC URL
const provider = ethers.Wallet.createRandom().connect(ethersProvider);

describe('<BottomMenu />', () => {
  let rendered: ReactTestRenderer | null = null;

  it('renders correctly', async () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: true }));

    await act(async () => {
      rendered = renderer
        .create(
          <BrowserRouter>
            <EtherspotTransactionKit provider={provider}>
              <ThemeProvider theme={defaultTheme}>
                <LanguageProvider>
                  <BottomMenuModalProvider>
                    <BottomMenu />
                  </BottomMenuModalProvider>
                </LanguageProvider>
              </ThemeProvider>
            </EtherspotTransactionKit>
          </BrowserRouter>
        )
    });

    const tree = rendered?.toJSON();
    expect(tree).toMatchSnapshot();

    const [bottomMenuElement] = tree as ReactTestRendererJSON[];

    expect((bottomMenuElement.children?.[0] as ReactTestRendererJSON)?.children?.length).toBe(1); // menu home button
    expect((bottomMenuElement.children?.[1] as ReactTestRendererJSON)?.children?.length).toBe(4); // other menu items
    expect(bottomMenuElement.type).toBe('div');
    expect(bottomMenuElement?.children?.[0]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);
    expect(bottomMenuElement?.children?.[1]).toHaveStyleRule('background', defaultTheme.color.background.bottomMenu);

    jest.clearAllMocks();
  });

  it('renders correctly if not authenticated', async () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: false }));

    await act(async () => {
      rendered = renderer
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
    });

    const tree = rendered?.toJSON();
    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement).toBe(null);

    jest.clearAllMocks();
  });
});


