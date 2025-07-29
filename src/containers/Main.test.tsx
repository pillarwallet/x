import { ReactNode } from 'react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import Main from './Main';

vi.mock('@sentry/react', () => ({
  setContext: vi.fn(),
  addBreadcrumb: vi.fn(),
  startTransaction: vi.fn(() => ({
    finish: vi.fn(),
  })),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

vi.mock('wagmi', () => {
  const actualWagmi = vi.importActual('wagmi');
  return {
    ...actualWagmi,
    createConfig: vi.fn(() => ({})),
    WagmiProvider: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    http: vi.fn(),
    mainnet: { id: 1 },
    useAccount: vi.fn().mockReturnValue({
      address: '0x',
      isConnected: false,
    }),
    useConnect: vi.fn().mockReturnValue({
      connectors: [],
      connect: vi.fn(),
      isPending: false,
      error: null,
    }),
  };
});

describe('<Main />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Main />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
