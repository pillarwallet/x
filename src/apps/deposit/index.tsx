/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Address, Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { base, gnosis, mainnet, polygon } from '@reown/appkit/networks';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitNetworkCore,
  useAppKitProvider,
  useDisconnect,
  useWalletInfo,
  type Provider,
} from '@reown/appkit/react';
import styled from 'styled-components';
import { createWalletClient, custom, parseUnits } from 'viem';
import AssetsList from './components/AssetsList/AssetsList';
import PillarXLogo from './images/logo512.png';
import './styles/tailwindDeposit.css';
import EthereumList from './utils/tokens/ethereum-tokens.json';
import GnosisList from './utils/tokens/gnosis-tokens.json';
import PolygonList from './utils/tokens/polygon-tokens.json';

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

const tokenLists = {
  1: EthereumList,
  137: PolygonList,
  100: GnosisList,
};

const App = () => {
  const { open, close } = useAppKit();
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { caipNetwork, caipNetworkId, switchNetwork } = useAppKitNetwork();
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  // console.log(address, isConnected, caipAddress, status);
  // console.log(caipNetwork, caipNetworkId, chainId, switchNetwork, walletInfo);

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleSendTx = async () => {
    const walletClient = createWalletClient({
      chain: mainnet, // or your desired chain configuration
      transport: custom(walletProvider),
    });

    const tx = await walletClient.sendTransaction({
      account: address as `0x${string}`,
      to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' as Address,
      value: parseUnits('0.0001', 18),
    });

    console.log(tx);
  };

  return (
    <Wrapper>
      <h1 className="text-4xl mb-8">Deposit</h1>
      <p className="text-base mb-8">
        Transfer funds from another wallet to PillarX. Click on &quot;Connect
        Wallet&quot; below to get started!
      </p>
      {isConnected ? (
        <button type="button" onClick={handleDisconnect}>
          Disconnect {address}
        </button>
      ) : (
        <button type="button" onClick={() => open({ view: 'Connect' })}>
          Connect Wallet
        </button>
      )}
      <button type="button" onClick={() => open({ view: 'Networks' })}>
        Switch network
      </button>
      {address && chainId && (
        <AssetsList accountAddress={address} chainId={chainId as number} />
      )}

      {/* <div className="flex flex-col gap-4 w-full">
        <p className="text-sm text-left">Select the asset you want to move</p>
        <div className="flex mb-4 w-full">
          <button
            type="button"
            className={`px-4 py-2 w-full ${
              activeTab === 'tokens'
                ? 'border-b-2 border-[#A55CD6] font-bold'
                : 'border-b border-gray-400'
            }`}
            onClick={() => setActiveTab('tokens')}
          >
            Tokens
          </button>
          <button
            type="button"
            className={`px-4 py-2 w-full ${
              activeTab === 'nfts'
                ? 'border-b-2 border-[#A55CD6] font-bold'
                : 'border-b border-gray-400'
            }`}
            onClick={() => setActiveTab('nfts')}
          >
            NFTs
          </button>
        </div>

        {activeTab === 'tokens' ? (
          <div>
            {combinedTokens.map((token) => (
              <div
                key={`${
                  token && 'name' in token ? token.address : token.tokenAddress
                }-${token.chain}`}
                className="flex flex-col w-full border border-[#3C3C53] rounded-xl px-6 py-4 mb-4 cursor-pointer"
                onClick={() => {
                  setSelectedAsset(token);
                }}
              >
                <div className="flex justify-between">
                  <div className="flex">
                    {token && 'name' in token && token.logoURI ? (
                      <img
                        src={token.logoURI}
                        alt="token-logo"
                        className="h-6 w-6 rounded"
                      />
                    ) : (
                      <Avatar
                        className="rounded-md"
                        size={24}
                        name={
                          token && 'name' in token
                            ? token.address
                            : token.tokenAddress
                        }
                        variant="marble"
                      />
                    )}
                    <p className="text-lg text-left">
                      {token && 'name' in token
                        ? `${token.name} (${token.symbol})`
                        : `${token.tokenAddress.substring(
                            0,
                            6
                          )}...${token.tokenAddress.substring(
                            token.tokenAddress.length - 6
                          )}`}
                    </p>
                  </div>

                  <p className="text-lg text-left">{token.balance}</p>
                </div>

                <p className="text-sm text-left">
                  on{' '}
                  <span className="capitalize">
                    {token.chain === 'xdai' ? 'gnosis' : token.chain}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {addedAssets
              .filter((asset) => asset.assetType === 'nft')
              .map((asset) => (
                <div
                  key={`${asset.tokenAddress}`}
                  className="flex flex-col w-full border border-[#3C3C53] rounded-xl px-6 py-4 mb-4 cursor-pointer"
                  onClick={() => {
                    setSelectedAsset(asset);
                  }}
                >
                  <div className="flex justify-between">
                    <p className="text-lg text-left">
                      {`${asset.tokenAddress.substring(
                        0,
                        6
                      )}...${asset.tokenAddress.substring(
                        asset.tokenAddress.length - 6
                      )}`}
                    </p>
                    <p className="text-lg text-left">{asset.balance}</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {isAddingAsset ? (
          <div className="flex gap-2 w-full items-end">
            <label className="text-sm text-left">
              Asset address
              <input
                type="text"
                value={newAsset.tokenAddress}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, tokenAddress: e.target.value })
                }
                required
                className="w-full h-8 !px-2 text-black !text-base !bg-white !rounded-md outline-none focus:outline-none focus:ring-0 focus:border focus:border-[#3C3C53]"
              />
            </label>

            {activeTab === 'nfts' && (
              <label className="text-sm text-left">
                Token ID
                <input
                  type="text"
                  value={newAsset.tokenId}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, tokenId: e.target.value })
                  }
                  required
                  className="w-full h-8 !px-2 text-black !text-base !bg-white !rounded-md outline-none focus:outline-none focus:ring-0 focus:border focus:border-[#3C3C53]"
                />
              </label>
            )}

            <label className="text-sm text-left">
              Chain
              <select
                value={newAsset.chain}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, chain: e.target.value })
                }
                required
                className="w-full h-8 !px-2 text-black !text-base !bg-white !rounded-md outline-none focus:outline-none focus:ring-0 focus:border focus:border-[#3C3C53]"
              >
                <option value="" disabled>
                  Select a chain
                </option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="optimism">Gnosis</option>
                <option value="xdai">Base</option>
              </select>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleAddAssetSubmit(activeTab)}
                className="px-4 bg-[#A55CD6] text-white rounded-md h-8"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsAddingAsset(false)}
                className="px-4 text-grey-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col w-full bg-[#A55CD6] hover:bg-[#B578DD] rounded-xl px-6 py-4 cursor-pointer"
            onClick={() => {
              setIsAddingAsset(true);
            }}
          >
            <p className="text-lg text-white">Add token or NFT</p>
          </div>
        )}
        <p className="text-sm text-white mt-4">{error || message}</p>
      </div> */}
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
