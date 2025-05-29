import axios from 'axios';
import { formatEther } from 'viem';

const useDeployWallet = () => {
  // This is to easily get the right localStorage key to retrieve
  const getWalletDeployedLocalStorageKey = (
    accountAddress: string,
    chainId: number
  ) => {
    return `wallet_deployed_${accountAddress}_${chainId}`;
  };

  // This is to easily get the right localStorage status with the right localStorage key to retrieve
  const getWalletDeployedLocalStorageStatus = (
    accountAddress: string,
    chainId: number
  ): boolean | undefined => {
    try {
      const localStorageKey = getWalletDeployedLocalStorageKey(
        accountAddress,
        chainId
      );
      const localStorageValue = localStorage.getItem(localStorageKey);
      if (localStorageValue === 'true') return true;
      if (localStorageValue === 'false') return false;
      return undefined; // Means it has not been added to localStorage yet
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return undefined;
    }
  };

  // This is to set the localStorage status with the right localStorage key
  const setWalletDeployedLocalStorageStatus = (
    accountAddress: string,
    chainId: number,
    isDeployed: boolean
  ) => {
    try {
      const localStorageKey = getWalletDeployedLocalStorageKey(
        accountAddress,
        chainId
      );
      localStorage.setItem(localStorageKey, isDeployed.toString());
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  };

  const getGasPrice = async (chainId: number): Promise<string | undefined> => {
    const apiKey = process.env.REACT_APP_ETHERSPOT_DATA_API_KEY;

    if (!chainId) {
      console.error('getGasPrice: chainId is required');
      return undefined;
    }

    if (!apiKey) {
      console.error('getGasPrice: API key is missing');
      return undefined;
    }

    const url = `https://rpc.etherspot.io/v2/${chainId}?api-key=${apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          method: 'skandha_getGasPrice',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.result.maxFeePerGas;
    } catch (error) {
      console.error('getGasPrice: Failed to get gas price', error);
      return undefined;
    }
  };

  const isWalletDeployed = async (
    accountAddress: string,
    chainId: number
  ): Promise<boolean | undefined> => {
    const apiKey = process.env.REACT_APP_ETHERSPOT_DATA_API_KEY;

    if (!accountAddress) {
      console.error('isWalletDeployed: accountAddress is required');
      return undefined;
    }

    if (!chainId) {
      console.error('isWalletDeployed: chainId is required');
      return undefined;
    }

    if (!apiKey) {
      console.error('isWalletDeployed: API key is missing');
      return undefined;
    }

    // Checking if this wallet has been deployed before using localStorage
    const localStorageStatus = getWalletDeployedLocalStorageStatus(
      accountAddress,
      chainId
    );

    // If wallet has been deployed no further calls will be made
    if (localStorageStatus === true) {
      return true;
    }

    // If wallet has not deployed, then we will check on chain
    const url = `https://rpc.etherspot.io/v2/${chainId}?api-key=${apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          method: 'eth_getCode',
          params: [accountAddress, 'latest'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const bytecode = response.data?.result;
      const isDeployed = bytecode && bytecode !== '0x';

      // Setting the localStorageValue based on the deployment status
      setWalletDeployedLocalStorageStatus(accountAddress, chainId, isDeployed);

      return isDeployed;
    } catch (error) {
      console.error(
        'isWalletDeployed: Failed to check if wallet is deployed',
        error
      );
      return undefined;
    }
  };

  const getWalletDeploymentCost = async ({
    accountAddress,
    chainId,
  }: {
    accountAddress: string;
    chainId: number;
  }): Promise<number> => {
    try {
      // Checking if wallet is already deployed with localStorage
      const isDeployed = await isWalletDeployed(accountAddress, chainId);

      if (isDeployed === undefined) {
        console.error(
          'getWalletDeploymentCost: Failed to check account deployment status'
        );
        return 0;
      }

      // Wallet is already deployed so no need to add extra gas cost
      if (isDeployed) {
        return 0;
      }

      // Wallet is not deployed so need to add extra gas cost
      const gasPriceHex = await getGasPrice(chainId);

      if (!gasPriceHex) {
        console.error('getWalletDeploymentCost: Failed to fetch gas price');
        return 0;
      }

      // Convert hex gas price to BigInt
      const gasPrice = BigInt(gasPriceHex);

      // This is a static gas unit for approx wallet deployment in "gas units" on all chains
      const gasUnits = BigInt(271000);

      // Calculate total gas cost in wei
      const gasCostWei = gasPrice * gasUnits;

      // Convert wei to ETH (18 decimals) and then to number
      const gasCostInEth = formatEther(gasCostWei);

      return parseFloat(gasCostInEth);
    } catch (error) {
      console.error(
        'getWalletDeploymentCost: Error calculating deployment cost',
        error
      );
      return 0;
    }
  };

  // This is to clear the localStorageStatus if needed
  const clearWalletDeployedLocalStorageStatus = (
    accountAddress: string,
    chainId: number
  ) => {
    try {
      const localStorageKey = getWalletDeployedLocalStorageKey(
        accountAddress,
        chainId
      );
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn('Failed to clear localStorageStatus:', error);
    }
  };

  return {
    getGasPrice,
    isWalletDeployed,
    getWalletDeploymentCost,
    clearWalletDeployedLocalStorageStatus,
  };
};

export default useDeployWallet;
