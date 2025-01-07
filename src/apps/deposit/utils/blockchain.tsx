/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import {
  Chain,
  PublicClient,
  createPublicClient,
  formatEther,
  getContract,
  http,
} from 'viem';
import { base, gnosis, mainnet, polygon } from 'viem/chains';
import { Network } from '../types/types';
import ERC1155_ABI from './abis/ERC1155.json';
import ERC20_ABI from './abis/ERC20Token.json';
import ERC721_ABI from './abis/ERC721.json';

export const processBigNumber = (val: BigNumber): number =>
  Number(val.toString());

export const processEth = (val: BigNumberish, dec: number): number => {
  if (typeof val === 'bigint') {
    return +parseFloat(formatEther(val)).toFixed(2);
  }

  return +parseFloat(formatUnits(val as BigNumberish, dec));
};

const chainMapping = {
  polygon: 'https://polygon-rpc.com',
  ethereum: 'https://ethereum-rpc.publicnode.com',
  gnosis: 'https://rpc.gnosischain.com',
  base: 'https://base-rpc.publicnode.com',
};

export const allNativeTokens: Record<
  Network,
  { name: string; symbol: string }
> = {
  ethereum: { name: 'Ether', symbol: 'ETH' },
  polygon: { name: 'MATIC', symbol: 'MATIC' },
  gnosis: { name: 'xDai', symbol: 'XDAI' },
  base: { name: 'Ether', symbol: 'ETH' },
};

export const getNetworkViem = (chainId: number): Chain => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 137:
      return polygon;
    case 100:
      return gnosis;
    case 8453:
      return base;
    default:
      return mainnet;
  }
};

export const getChainId = (chain: string): number => {
  switch (chain) {
    case 'ethereum':
      return 1;
    case 'polygon':
      return 137;
    case 'gnosis':
      return 100;
    case 'base':
      return 8453;
    default:
      return 1;
  }
};

export const getChainName = (chain: number): Network | string => {
  switch (chain) {
    case 1:
      return 'ethereum';
    case 137:
      return 'polygon';
    case 8453:
      return 'base';
    case 100:
      return 'gnosis';
    default:
      return `${chain}`;
  }
};

// Function to check if an address is a contract
// eslint-disable-next-line consistent-return
async function isContract(address: string, provider: PublicClient) {
  try {
    const code = await provider.getCode({ address: address as `0x${string}` });
    if (code !== '0x') return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

// Function to filter out invalid addresses
async function filterValidTokens(tokens: string[], provider: PublicClient) {
  const validTokens = [];
  for (const token of tokens) {
    if (
      token !== ethers.constants.AddressZero &&
      (await isContract(token, provider))
    ) {
      validTokens.push(token);
    }
  }
  return validTokens;
}

export const getBalances = async (
  accountAddress: string,
  tokenAddressesList: string[],
  chainId: number
): Promise<{ address: string; balance: string }[]> => {
  const chain = getNetworkViem(chainId);
  const chainUrl = chainMapping[chain.name.toLowerCase() as Network] || null;

  try {
    if (!chainUrl) {
      throw new Error(`Unsupported chain: ${chain.name}`);
    }

    const client = createPublicClient({
      chain,
      transport: http(chainUrl),
    });

    const validTokens = await filterValidTokens(tokenAddressesList, client);

    const balancePromises = validTokens.map(async (tokenAddress) => {
      try {
        const balance = await client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI.abi,
          functionName: 'balanceOf',
          args: [accountAddress as `0x${string}`],
        });
        return { address: tokenAddress, balance: String(balance) };
      } catch (error) {
        console.error(
          `Failed to fetch balance for token ${tokenAddress}:`,
          error
        );
        return { address: tokenAddress, balance: '0' }; // Default to 0 if an error occurs
      }
    });

    const results = await Promise.all(balancePromises);

    return results;
  } catch (error) {
    console.error('Failed to fetch all tokens balances:', error);
    return [];
  }
};

export const getNativeBalance = async (
  accountAddress: string,
  chainId: number
): Promise<string | number> => {
  const chain = getNetworkViem(chainId);
  const chainUrl = chainMapping[chain.name.toLowerCase() as Network] || null;

  try {
    if (!chainUrl) {
      throw new Error(`Unsupported chain: ${chain.name}`);
    }

    const provider = createPublicClient({
      chain,
      transport: http(chainUrl),
    });

    const nativeTokenBalance = await provider.getBalance({
      address: accountAddress as `0x${string}`,
    });

    const balanceInEther = formatEther(nativeTokenBalance);

    return Number(balanceInEther);
  } catch (error) {
    return `Error to get the native balance for chain: ${chain.name}, ${error}`;
  }
};

export const getDecimal = async (
  tokenAddress: string,
  chainId: number
): Promise<string | number> => {
  const chain = getNetworkViem(chainId);
  const chainUrl = chainMapping[chain.name.toLowerCase() as Network] || null;

  try {
    if (!chainUrl) {
      throw new Error(`Unsupported chain: ${chain.name}`);
    }

    const provider = createPublicClient({
      chain,
      transport: http(chainUrl),
    });

    const contract = getContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI.abi,
      client: provider,
    });

    const result = await contract.read.decimals();

    return result as number;
  } catch (error) {
    return `Error to get the decimal for token: ${tokenAddress}, ${error}`;
  }
};

// // TO DO - use it in future versions
// export const getNftName = async (
//   nftAddress: string,
//   chain: string
// ): Promise<string | undefined> => {
//   const chainUrl = chainMapping[chain as Network] || null;

//   if (!chainUrl) {
//     console.error(`Unsupported chain: ${chain}`);
//     return '';
//   }

//   try {
//     // ERC-721 or ERC-1155 ABI
//     const abiERC721 = await import(
//       './contracts/artifacts-etherspot-v1/ERC721.json',
//       {
//         with: { type: 'json' },
//       }
//     );

//     const provider = createPublicClient({
//       chain: getNetworkViem(chain as Network),
//       transport: http(chainUrl),
//     });

//     const contract = getContract({
//       address: nftAddress as `0x${string}`,
//       abi: abiERC721.default,
//       client: provider,
//     });

//     const nftName = await contract.read.name();
//     return nftName as string;
//   } catch (error) {
//     console.error(`Unexpected error fetching name for ${nftAddress}: ${error}`);
//     return undefined;
//   }
// };

export const getNftBalance = async (
  accountAddress: string,
  nftAddress: string,
  nftId: string,
  chainId: number
): Promise<number> => {
  const chain = getNetworkViem(chainId);
  const chainUrl = chainMapping[chain.name.toLowerCase() as Network] || null;

  if (!chainUrl) {
    console.error(`Unsupported chain: ${chain.name}`);
    return 0;
  }

  try {
    const provider = createPublicClient({
      chain,
      transport: http(chainUrl),
    });

    const contractERC721 = getContract({
      address: nftAddress as `0x${string}`,
      abi: ERC721_ABI,
      client: provider,
    });

    const contractERC1155 = getContract({
      address: nftAddress as `0x${string}`,
      abi: ERC1155_ABI,
      client: provider,
    });

    try {
      // Attempt ERC721 balance
      const resultERC721 = await contractERC721.read.balanceOf([
        accountAddress,
      ]);
      return processBigNumber(resultERC721 as BigNumber);
    } catch (errorERC721) {
      console.warn(`ERC721 balance fetch failed: ${errorERC721}`);

      // Fallback to ERC1155
      try {
        const resultERC1155 = await contractERC1155.read.balanceOf([
          accountAddress,
          nftId,
        ]);
        return processBigNumber(resultERC1155 as BigNumber);
      } catch (errorERC1155) {
        console.error(`ERC1155 balance fetch also failed: ${errorERC1155}`);
        return 0;
      }
    }
  } catch (error) {
    console.error(
      `Unexpected error fetching balances for chain ${chain.name}: ${error}`
    );
    return 0;
  }
};
