/* eslint-disable @typescript-eslint/no-use-before-define */
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import {
  arbitrum,
  base,
  bsc,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetworkCore,
  useDisconnect,
} from '@reown/appkit/react';
import { useEffect } from 'react';

// styles
import styled from 'styled-components';
import './styles/tailwindDeposit.css';

// utils
import { getNetworkViem } from './utils/blockchain';

// reducer
import { setDepositStep } from './reducer/depositSlice';

// hooks
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';

// components
import AssetsList from './components/AssetsList/AssetsList';
import SendAsset from './components/SendAsset/SendAsset';

// images
import PillarXLogo from './images/logo512.png';

const isGnosisEnabled = import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true';

const metadataReownAppKit = {
  name: 'PillarX',
  description: 'PillarX App',
  url: 'https://pillarx.app',
  icons: [PillarXLogo],
};

const allNetworks = [mainnet, polygon, base, gnosis, bsc, optimism, arbitrum];

createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadataReownAppKit,
  networks: (isGnosisEnabled
    ? allNetworks
    : allNetworks.filter((n) => n.id !== gnosis.id)) as [
    typeof mainnet,
    ...(typeof mainnet)[],
  ],
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID || '',
  features: {
    swaps: false,
    onramp: false,
    history: false,
    email: false,
    socials: false,
    emailShowWallets: false,
  },
});

const App = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetworkCore();
  const events = useAppKitEvents();
  const dispatch = useAppDispatch();
  const depositStep = useAppSelector(
    (state) => state.deposit.depositStep as 'list' | 'send'
  );

  useEffect(() => {
    if (events.data.event === 'SWITCH_NETWORK') {
      dispatch(setDepositStep('list'));
    }
  }, [events, dispatch]);

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <Wrapper id="deposit-app">
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
            <p
              id="deposit-app-address-connected"
              className="truncate text-base bg-white/10 px-4 py-2 rounded-3xl max-w-full"
            >
              {address}
            </p>
          )}
          <button
            id="deposit-app-connect-disconnect-button"
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
            id="deposit-app-switch-network-button"
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
  margin: 0 auto 60px auto;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 52px 60px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export default App;
