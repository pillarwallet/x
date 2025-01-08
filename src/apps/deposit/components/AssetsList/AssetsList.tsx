/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-await-in-loop */
import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';

// hooks
import { useAppDispatch } from '../../hooks/useReducerHooks';

// reducer
import { setDepositStep, setSelectedAsset } from '../../reducer/depositSlice';

// types
import {
  AddedAssets,
  BalanceInfo,
  Network,
  TokenList,
} from '../../types/types';

// utils
import {
  allNativeTokens,
  getBalances,
  getDecimal,
  getNativeBalance,
  getNetworkViem,
  getNftBalance,
} from '../../utils/blockchain';
import EthereumList from '../../utils/tokens/ethereum-tokens.json';
import GnosisList from '../../utils/tokens/gnosis-tokens.json';
import PolygonList from '../../utils/tokens/polygon-tokens.json';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Asset from '../Asset/Asset';

const tokenLists = {
  1: EthereumList,
  137: PolygonList,
  100: GnosisList,
};

type AssetsListProps = {
  accountAddress: string;
  chainId: number;
};
const AssetsList = ({ accountAddress, chainId }: AssetsListProps) => {
  const [balances, setBalances] = useState<BalanceInfo[]>([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newAsset, setNewAsset] = useState({
    chain: '',
    tokenAddress: '',
    tokenId: '',
  });
  const dispatch = useAppDispatch();
  const [addedAssets, setAddedAssets] = useState<AddedAssets[]>(() => {
    const storedAssets = localStorage.getItem('addedAssets');
    return storedAssets
      ? JSON.parse(storedAssets).filter(
          (token: AddedAssets) => token.balance > 0
        )
      : [];
  });
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');

  const chainName = getNetworkViem(chainId).name.toLowerCase();

  const getAllBalances = useCallback(
    async (tokenList: TokenList[]): Promise<BalanceInfo[]> => {
      const tokenAddresses = tokenList.map((token) => token.address);
      let retries = 0;
      const maxRetries = 3;

      setError(null);

      while (retries < maxRetries) {
        try {
          const allBalances = await getBalances(
            accountAddress,
            tokenAddresses,
            chainId
          );

          // Fetch native balance
          const nativeBalance = await getNativeBalance(accountAddress, chainId);

          // Prepare the native token information
          const nativeTokenInfo: BalanceInfo = {
            chain: chainName,
            address: '0x0000000000000000000000000000000000000000',
            decimals: 18,
            balance: nativeBalance,
            name: allNativeTokens[chainName as Network].name,
            symbol: allNativeTokens[chainName as Network].symbol,
            logoURI: '',
          };

          // Convert balances array to BalanceInfo
          const tokenBalances = allBalances
            .map(
              (
                tokenBalance: { address: string; balance: string },
                index: number
              ) => {
                const token = tokenList[index];
                const readableBalance = formatUnits(
                  BigInt(tokenBalance.balance),
                  Number(token?.decimals)
                );

                return {
                  chain: chainName,
                  address: tokenBalance.address,
                  decimals: Number(token?.decimals || 18),
                  balance: readableBalance,
                  name: token?.name ?? 'Unknown token',
                  symbol: token?.symbol ?? '',
                  logoURI: token?.logoURI ?? '',
                };
              }
            )
            .filter(
              (tokenInfo: BalanceInfo) => parseFloat(tokenInfo.balance) > 0
            );

          return [nativeTokenInfo, ...tokenBalances];
        } catch (e) {
          retries += 1;
          console.error(
            `Attempt ${retries} - Error fetching balances for ${chainName}:`,
            e
          );

          if (retries >= maxRetries) {
            setError(
              `Error fetching balances for ${chainName} after ${maxRetries} attempts. Please try again.`
            );
          }
        }
      }
      return [];
    },
    [accountAddress, chainId, chainName]
  );

  const getNftBalances = async (
    nftAddress: string,
    nftId: string
  ): Promise<number> => {
    try {
      const balance = await getNftBalance(
        accountAddress,
        nftAddress,
        nftId,
        chainId
      );

      return balance;
    } catch (e) {
      console.error('Error fetching balance:', e);
      setError(
        `Error fetching balance of the asset ${nftAddress}. Please make sure the asset address and token id is valid.`
      );
      setTimeout(() => {
        setError(null);
      }, 5000);
      return 0;
    }
  };

  const fetchBalances = async () => {
    try {
      const balancesForChain = await getAllBalances(
        tokenLists[chainId as keyof typeof tokenLists].tokens as TokenList[]
      );
      setBalances(balancesForChain);
    } catch (e) {
      console.error(`Error fetching balances for chain ${chainId}:`, e);
    }
  };

  const refetchBalances = async () => {
    const updatedAssets = await Promise.all(
      addedAssets.map(async (asset) => {
        let updatedBalance = 0;

        if (asset.assetType === 'token') {
          const tokenBalance = await getBalances(
            accountAddress,
            [asset.tokenAddress],
            chainId
          );

          const tokenDecimals = await getDecimal(asset.tokenAddress, chainId);

          const readableBalance = formatUnits(
            BigInt(tokenBalance[0].balance),
            Number(tokenDecimals || 18)
          );
          updatedBalance = Number(readableBalance);
        } else if (asset.assetType === 'nft') {
          updatedBalance = await getNftBalances(
            asset.tokenAddress,
            asset.tokenId || ''
          );
        }

        return {
          ...asset,
          balance: updatedBalance,
        };
      })
    );

    const filteredAssets = updatedAssets.filter((asset) => asset.balance > 0);
    setAddedAssets(filteredAssets);
    localStorage.setItem('addedAssets', JSON.stringify(filteredAssets));
  };

  useEffect(() => {
    const handleBalances = async () => {
      if (accountAddress && chainId) {
        setIsLoading(true); // Start loading

        await fetchBalances();
        await refetchBalances();

        setIsLoading(false);
      }
    };

    handleBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, chainId]);

  useEffect(() => {
    if (accountAddress && chainId) {
      fetchBalances();
      refetchBalances();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, chainId]);

  const addAsset = (asset: AddedAssets) => {
    // Check if the asset already exists
    const addedAssetExists = addedAssets.some(
      (a) => a.tokenAddress === asset.tokenAddress
    );
    const assetExists = balances.some((a) => a.address === asset.tokenAddress);

    if (addedAssetExists || assetExists) {
      setError('The asset already exists');
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    const updatedAssets = [...addedAssets, asset].filter(
      (token) => token.balance > 0
    );
    setAddedAssets(updatedAssets);
    localStorage.setItem('addedAssets', JSON.stringify(updatedAssets));
  };

  const handleAddAssetSubmit = async (type: 'tokens' | 'nfts') => {
    if (newAsset.tokenAddress && chainName && type === 'tokens') {
      const newAssetBalance = await getBalances(
        accountAddress,
        [newAsset.tokenAddress],
        chainId
      );

      const newAssetDecimals = await getDecimal(
        newAssetBalance[0].address,
        chainId
      );

      const readableBalance = formatUnits(
        BigInt(newAssetBalance[0].balance),
        Number(newAssetDecimals || 18)
      );

      if (Number(readableBalance) > 0) {
        addAsset({
          chain: chainName,
          tokenAddress: newAsset.tokenAddress,
          balance: Number(readableBalance),
          assetType: 'token',
        });
      }
      setMessage(
        `New asset ${newAsset.tokenAddress} on ${(
          <span className="capitalize">{chainName}</span>
        )} successfully added`
      );
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setNewAsset({ tokenAddress: '', chain: '', tokenId: '' });
      setIsAddingAsset(false);
    }

    if (
      newAsset.tokenAddress &&
      chainName &&
      newAsset.tokenId &&
      type === 'nfts'
    ) {
      const newAssetBalance = await getNftBalances(
        newAsset.tokenAddress,
        newAsset.tokenId
      );

      if (newAssetBalance > 0) {
        addAsset({
          chain: chainName,
          tokenAddress: newAsset.tokenAddress,
          balance: newAssetBalance,
          assetType: 'nft',
          tokenId: newAsset.tokenId,
        });
      }
      setMessage(`New asset ${newAsset.tokenAddress} successfully added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setNewAsset({ tokenAddress: '', chain: '', tokenId: '' });
      setIsAddingAsset(false);
    }
  };

  const combinedTokens = [
    ...balances,
    ...addedAssets.filter(
      (asset) => asset.assetType === 'token' && asset.chain === chainName
    ),
  ];

  return (
    <div
      id="deposit-app-assets-list"
      className="flex flex-col gap-4 w-full mt-8"
    >
      <p className="text-sm text-left">Select the asset you want to move</p>
      <div className="flex mb-4 w-full">
        <button
          type="button"
          className={`px-4 py-2 w-full ${
            activeTab === 'tokens'
              ? 'border-b-2 border-purple_medium font-bold'
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
              ? 'border-b-2 border-purple_medium font-bold'
              : 'border-b border-gray-400'
          }`}
          onClick={() => setActiveTab('nfts')}
        >
          NFTs
        </button>
      </div>

      {activeTab === 'tokens' ? (
        <div>
          {isLoading ? (
            <div data-testid="assets-list-loader" className="flex flex-col">
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
            </div>
          ) : (
            combinedTokens.map((token) => (
              <Asset
                key={`${
                  token && 'name' in token ? token.address : token.tokenAddress
                }-${token.chain}`}
                onSelectAsset={() => {
                  dispatch(setSelectedAsset(token));
                  dispatch(setDepositStep('send'));
                }}
                type="token"
                asset={token}
              />
            ))
          )}
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div data-testid="assets-list-loader" className="flex flex-col">
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
              <SkeletonLoader
                $height="82px"
                $radius="6px"
                $marginBottom="16px"
              />
            </div>
          ) : (
            addedAssets
              .filter((asset) => asset.assetType === 'nft')
              .map((asset) => (
                <Asset
                  key={`${(asset as AddedAssets).tokenAddress}`}
                  onSelectAsset={() => {
                    dispatch(setSelectedAsset(asset));
                    dispatch(setDepositStep('send'));
                  }}
                  type="nft"
                  asset={asset}
                />
              ))
          )}
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
              value={chainName}
              onChange={(e) =>
                setNewAsset({ ...newAsset, chain: e.target.value })
              }
              disabled
              required
              className="w-full h-8 !px-2 text-black !text-base !bg-white !rounded-md outline-none focus:outline-none focus:ring-0 focus:border focus:border-[#3C3C53]"
            >
              <option value={chainName} className="capitalize">
                {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
              </option>
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
          className="flex flex-col w-fit self-center bg-purple_medium hover:bg-purple_light rounded-xl px-6 py-4 cursor-pointer"
          onClick={() => {
            setIsAddingAsset(true);
          }}
        >
          <p className="text-lg text-white text-center">Add token or NFT</p>
        </div>
      )}
      <p className="text-sm text-white mt-4">{error || message}</p>
    </div>
  );
};

export default AssetsList;
