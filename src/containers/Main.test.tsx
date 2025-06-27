import { ReactNode } from 'react';
import renderer from 'react-test-renderer';

// components
import Main from './Main';

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
  };
});

describe('<Main />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Main />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
