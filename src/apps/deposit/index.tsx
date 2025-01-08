/* eslint-disable @typescript-eslint/no-use-before-define */
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { base, gnosis, mainnet, polygon } from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore,
  useDisconnect,
} from '@reown/appkit/react';
import styled from 'styled-components';
import AssetsList from './components/AssetsList/AssetsList';
import SendAsset from './components/SendAsset/SendAsset';
import { useAppSelector } from './hooks/useReducerHooks';
import PillarXLogo from './images/logo512.png';
import './styles/tailwindDeposit.css';
import { getNetworkViem } from './utils/blockchain';

const metadataReownAppKit = {
  name: 'PillarX',
  description: 'PillarX App',
  url: 'https://pillarx.app',
  icons: [PillarXLogo],
};

createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadataReownAppKit,
  networks: [mainnet, polygon, base, gnosis],
  projectId: process.env.REACT_APP_REOWN_PROJECT_ID || '',
  features: {
    swaps: false,
    onramp: false,
    history: false,
  },
});

const App = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetworkCore();
  const depositStep = useAppSelector(
    (state) => state.deposit.depositStep as 'list' | 'send'
  );

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <Wrapper>
      <h1 className="text-4xl mb-8">Deposit</h1>
      <div className="flex flex-col gap-2 w-full items-center">
        <p className={`text-base self-center ${!isConnected && 'mb-8'}`}>
          {!isConnected &&
            'Transfer funds from another wallet to PillarX. Click on "Connect Wallet" below to get started!'}
        </p>
        <div
          className={`flex gap-4 w-full ${isConnected ? 'justify-between' : 'justify-center'} desktop:max-w-[680px]`}
        >
          {isConnected && (
            <p className="truncate text-base bg-white/10 px-4 py-2 rounded-3xl max-w-full">
              {address}
            </p>
          )}
          <button
            type="button"
            className="w-fit h-fit px-4 py-2 rounded-md bg-purple_medium hover:bg-purple_light"
            onClick={
              isConnected ? handleDisconnect : () => open({ view: 'Connect' })
            }
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
        <div
          className={`flex gap-4 w-full ${isConnected ? 'justify-between' : 'justify-center'} desktop:max-w-[680px]`}
        >
          <p className="truncate text-base bg-white/10 px-4 py-2 rounded-3xl max-w-full">
            {getNetworkViem(Number(chainId)).name}
          </p>
          <button
            type="button"
            className="w-fit h-fit px-4 py-2 rounded-md bg-purple_medium hover:bg-purple_light"
            onClick={() => open({ view: 'Networks' })}
          >
            Switch network
          </button>
        </div>
      </div>

      {address && chainId && depositStep === 'list' && (
        <AssetsList accountAddress={address} chainId={chainId as number} />
      )}
      {address && chainId && depositStep === 'send' && <SendAsset />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 52px 60px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export default App;
