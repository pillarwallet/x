import renderer from 'react-test-renderer';

// components
import Main from './Main';

jest.mock('wagmi', () => {
  const actualWagmi = jest.requireActual('wagmi');
  return {
    ...actualWagmi,
    createConfig: jest.fn(() => ({})),
    WagmiProvider: ({ children }: any) => <div>{children}</div>,
    http: jest.fn(),
    mainnet: { id: 1 },
  };
});

describe('<Main />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Main />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
