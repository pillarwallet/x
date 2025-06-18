import { ITransaction } from '@etherspot/transaction-kit';
import { BigNumber, ethers } from 'ethers';
import { processEth } from '../apps/the-exchange/utils/blockchain';
import { AssetSelectOption } from '../components/Form/AssetSelect';
import { SendModalData } from '../types';
import { decodeSendTokenCallData } from './blockchain';

export const getObjectHash = (obj: unknown, salt?: string | number) => {
  const checksum = `${JSON.stringify(obj)}-${salt}`;
  return ethers.utils.hexlify(Buffer.from(checksum));
};

export const pasteFromClipboard = async (onPaste: (text: string) => void) => {
  try {
    await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    });
  } catch (e) {
    //
  }

  try {
    const copied = await navigator.clipboard.readText();
    onPaste(copied);
  } catch (e) {
    //
  }
};

export const copyToClipboard = async (text: string, onSuccess?: () => void) => {
  try {
    const result = await navigator.permissions.query({
      name: 'clipboard-write' as PermissionName,
    });
    if (result.state !== 'granted' && result.state !== 'prompt') return;
    await navigator.clipboard.writeText(text);
    if (onSuccess) {
      onSuccess();
    }
  } catch (e) {
    //
  }
};

export const convertDateToUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const getShorterTimeUnits = (formattedDistanceToNowDate: string) => {
  // Replace long units with shorter units and delete white space before the units
  return formattedDistanceToNowDate
    .replace('seconds', 's')
    .replace('second', 's')
    .replace('minutes', 'min')
    .replace('minute', 'min')
    .replace('hours', 'h')
    .replace('hour', 'h')
    .replace('days', 'd')
    .replace('day', 'd')
    .replace('months', 'mo')
    .replace('month', 'mo')
    .replace(/(\d+)\s+(?=[a-zA-Z])/g, '$1');
};

export const transactionDescription = (
  selectedAsset: AssetSelectOption | undefined,
  transaction: ITransaction | undefined,
  payload: SendModalData | undefined
) => {
  if (selectedAsset?.type === 'token') {
    if (transaction?.value) {
      return `${processEth(transaction.value as BigNumber, selectedAsset.asset.decimals)} ${selectedAsset.asset.symbol} to ${transaction.to.substring(0, 6)}...${transaction.to.substring(transaction.to.length - 5)}`;
    }
    if (!transaction?.value && transaction?.data) {
      const decodedTransferData = decodeSendTokenCallData(transaction.data);
      return `${processEth(decodedTransferData[1] as BigNumber, selectedAsset.asset.decimals)} ${selectedAsset.asset.symbol} to ${decodedTransferData[0].substring(0, 6)}...${decodedTransferData[0].substring(transaction.to.length - 5)}`;
    }
  }

  return payload?.description;
};
