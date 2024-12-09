import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import renderer, {
  ReactTestRenderer,
  ReactTestRendererJSON,
  act,
} from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

// components
import BottomMenu from '.';

// theme
import { defaultTheme } from '../../theme';

// providers
import AccountBalancesProvider from '../../providers/AccountBalancesProvider';
import AccountNftsProvider from '../../providers/AccountNftsProvider';
import AccountTransactionHistoryProvider from '../../providers/AccountTransactionHistoryProvider';
import AssetsProvider from '../../providers/AssetsProvider';
import BottomMenuModalProvider from '../../providers/BottomMenuModalProvider';
import GlobalTransactionsBatchProvider from '../../providers/GlobalTransactionsBatchProvider';
import LanguageProvider from '../../providers/LanguageProvider';
import SelectedChainsHistoryProvider from '../../providers/SelectedChainsHistoryProvider';

// services and store
import { pillarXApiTransactionsHistory } from '../../services/pillarXApiTransactionsHistory';
import { addMiddleware, store } from '../../store';

const ethersProvider = new ethers.providers.JsonRpcProvider(
  'http://localhost:8545',
  'goerli'
); // replace with your node's RPC URL
const provider = ethers.Wallet.createRandom().connect(ethersProvider);

describe('<BottomMenu />', () => {
  let rendered: ReactTestRenderer | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    store.replaceReducer(() => ({}));
    addMiddleware(pillarXApiTransactionsHistory);
  });

  it('renders correctly when authenticated', async () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({ authenticated: true }));

    await act(async () => {
      rendered = renderer.create(
        <Provider store={store}>
          <BrowserRouter>
            <EtherspotTransactionKit provider={provider}>
              <AccountTransactionHistoryProvider>
                <AssetsProvider>
                  <AccountBalancesProvider>
                    <AccountNftsProvider>
                      <ThemeProvider theme={defaultTheme}>
                        <LanguageProvider>
                          <GlobalTransactionsBatchProvider>
                            <BottomMenuModalProvider>
                              <SelectedChainsHistoryProvider>
                                <BottomMenu />
                              </SelectedChainsHistoryProvider>
                            </BottomMenuModalProvider>
                          </GlobalTransactionsBatchProvider>
                        </LanguageProvider>
                      </ThemeProvider>
                    </AccountNftsProvider>
                  </AccountBalancesProvider>
                </AssetsProvider>
              </AccountTransactionHistoryProvider>
            </EtherspotTransactionKit>
          </BrowserRouter>
        </Provider>
      );
    });

    const tree = rendered?.toJSON();
    expect(tree).toMatchSnapshot();

    const [bottomMenuElement] = tree as ReactTestRendererJSON[];

    expect(
      (bottomMenuElement.children?.[1] as ReactTestRendererJSON)?.children
        ?.length
    ).toBe(5); // other menu items
    expect(bottomMenuElement.type).toBe('div');

    jest.clearAllMocks();
  });

  it('renders correctly if not authenticated', async () => {
    (usePrivy as jest.Mock).mockImplementation(() => ({
      authenticated: false,
    }));

    await act(async () => {
      rendered = renderer.create(
        <BrowserRouter>
          <ThemeProvider theme={defaultTheme}>
            <LanguageProvider>
              <GlobalTransactionsBatchProvider>
                <BottomMenuModalProvider>
                  <SelectedChainsHistoryProvider>
                    <BottomMenu />
                  </SelectedChainsHistoryProvider>
                </BottomMenuModalProvider>
              </GlobalTransactionsBatchProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      );
    });

    const tree = rendered?.toJSON();
    expect(tree).toMatchSnapshot();

    const treeElement = tree as ReactTestRendererJSON;
    expect(treeElement).toBe(null);

    jest.clearAllMocks();
  });
});
