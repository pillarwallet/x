import Avatar from 'boring-avatars';

// utils
import { chainNameDataCompatibility } from '../../../../services/tokensData';

// hooks
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { AddedAssets, BalanceInfo } from '../../types/types';

type AssetProps = {
  onSelectAsset?: () => void;
  type: 'token' | 'nft';
  asset: BalanceInfo | AddedAssets;
};
const Asset = ({ onSelectAsset, type, asset }: AssetProps) => {
  const selectedAsset = useAppSelector(
    (state) =>
      state.deposit.selectedAsset as BalanceInfo | AddedAssets | undefined
  );
  return type === 'token' ? (
    <div
      id="deposit-app-token-asset"
      className={`flex flex-col w-full border border-[#3C3C53] rounded-xl px-6 py-4 mb-4 mt-8 ${!selectedAsset && 'cursor-pointer mt-0'}`}
      onClick={onSelectAsset}
      data-testid="deposit-asset"
    >
      <div className="flex justify-between">
        <div className="flex gap-2">
          {asset && 'name' in asset && asset.logoURI ? (
            <img
              src={asset.logoURI}
              alt="token-logo"
              className="h-6 w-6 rounded"
            />
          ) : (
            <Avatar
              className="rounded-md"
              size={24}
              name={
                asset && 'name' in asset ? asset.address : asset.tokenAddress
              }
              variant="marble"
            />
          )}
          <p className="text-lg text-left">
            {asset && 'name' in asset
              ? `${asset.name} (${asset.symbol})`
              : `${asset.tokenAddress.substring(
                  0,
                  6
                )}...${asset.tokenAddress.substring(
                  asset.tokenAddress.length - 6
                )}`}
          </p>
        </div>

        <p className="text-lg text-left">{asset.balance}</p>
      </div>

      <p className="text-sm text-left">
        on{' '}
        <span className="capitalize">
          {chainNameDataCompatibility(asset.chain)}
        </span>
      </p>
    </div>
  ) : (
    <div
      id="deposit-app-nft-asset"
      className={`flex flex-col w-full border border-[#3C3C53] rounded-xl px-6 py-4 mb-4 mt-8 ${!selectedAsset && 'cursor-pointer mt-0'}`}
      onClick={onSelectAsset}
      data-testid="deposit-asset"
    >
      <div className="flex justify-between">
        <p className="text-lg text-left">
          {`${(asset as AddedAssets).tokenAddress.substring(
            0,
            6
          )}...${(asset as AddedAssets).tokenAddress.substring((asset as AddedAssets).tokenAddress.length - 6)}`}
        </p>
        <p className="text-lg text-left">{asset.balance}</p>
      </div>
    </div>
  );
};

export default Asset;
