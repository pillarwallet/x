import { useWalletAddress } from '@etherspot/transaction-kit';
import { Provider } from '@reown/appkit-adapter-ethers5';
import {
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
} from '@reown/appkit/react';
import { useState } from 'react';
import { IoMdReturnLeft } from 'react-icons/io';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setDepositStep } from '../../reducer/depositSlice';

// types
import { AddedAssets, BalanceInfo } from '../../types/types';

// utils
import { transferNft, transferTokens } from '../../utils/blockchain';

// components
import Asset from '../Asset/Asset';

const SendAsset = () => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const [amount, setAmount] = useState('');
  const walletAddress = useWalletAddress();
  const dispatch = useAppDispatch();
  const selectedAsset = useAppSelector(
    (state) =>
      state.deposit.selectedAsset as BalanceInfo | AddedAssets | undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!selectedAsset || !address || !walletAddress) return null;

  const assetType =
    selectedAsset.type === 'AddedAsset' && selectedAsset.assetType === 'nft'
      ? 'nft'
      : 'token';

  if (assetType === 'nft') {
    setAmount('1');
  }
  const handleSendTx = async () => {
    if (assetType === 'token') {
      try {
        const txHash = await transferTokens(
          Number(chainId),
          walletProvider,
          selectedAsset,
          address,
          walletAddress,
          amount
        );

        setMessage(
          `The transaction has succesfully been sent to your external wallet with the transaction hash: ${txHash}. Please check your external wallet to follow the transaction status.`
        );

        setTimeout(() => {
          setMessage(null);
        }, 10000);
      } catch (e) {
        console.error('Error sending transaction to external wallet:', e);
        setError(
          'An error occured while sending the transaction to your external wallet. Please try again'
        );

        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    }

    if (assetType === 'nft') {
      try {
        const txHash = await transferNft(
          Number(chainId),
          walletProvider,
          selectedAsset,
          address,
          walletAddress
        );

        setMessage(
          `The transaction has succesfully been sent to your external wallet with the transaction hash: ${txHash}. Please check your external wallet to follow the transaction status.`
        );

        setTimeout(() => {
          setMessage(null);
        }, 10000);
      } catch (e) {
        console.error('Error sending transaction to external wallet:', e);
        setError(
          'An error occured while sending the transaction to your external wallet. Please try again'
        );

        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amountValue = event.target.value;
    setAmount(amountValue);
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => dispatch(setDepositStep('list'))}
        className="flex w-fit mt-8 items-center gap-2 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-white"
      >
        <IoMdReturnLeft size={20} />
        <p>Back</p>
      </button>

      {selectedAsset && (
        <div className="flex flex-col">
          <Asset
            type={
              selectedAsset?.type === 'AddedAsset' &&
              selectedAsset.assetType === 'nft'
                ? 'nft'
                : 'token'
            }
            asset={selectedAsset}
          />
          <div className="flex flex-col gap-2 items-center">
            <p className="text-base">
              {assetType === 'token'
                ? 'How much would you like to deposit in your PillarX Wallet?'
                : 'Transfer the amount of 1 NFT'}
            </p>
            {assetType === 'token' && (
              <input
                type="number"
                value={amount}
                onChange={handleInputChange}
                placeholder="Enter a token amount"
                required
                className="max-w-full !py-4 !bg-white/10 !px-2 text-white !text-xl !bg-white !rounded-md outline-none focus:outline-none focus:ring-0 focus:border focus:border-[#3C3C53]"
              />
            )}
          </div>
          {Number(amount) > 0 && (
            <button
              type="button"
              onClick={handleSendTx}
              className="w-fit h-fit self-center px-4 py-2 mt-4 rounded-md bg-purple_medium hover:bg-purple_light"
            >
              Start transfer
            </button>
          )}
        </div>
      )}
      <p className="text-sm text-white mt-4">{error || message}</p>
    </div>
  );
};

export default SendAsset;
