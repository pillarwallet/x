import axios from 'axios';
import { mainnet, sepolia } from 'viem/chains';

const chainIdToBlastApiPrefix: { [chainId: number]: string } = {
  [mainnet.id]: 'eth-mainnet',
  [sepolia.id]: 'eth-sepolia',
}

export const callBlastApi = async (
  chainId: number,
  method: string,
  params: unknown[],
): Promise<unknown> => {
  let result;

  const blastApiPrefix = chainIdToBlastApiPrefix[chainId];
  if (!blastApiPrefix) {
    console.warn('Missing Blast API prefix for chainId', chainId);
    return;
  }

  const url = `https://${blastApiPrefix}.blastapi.io/${process.env.REACT_APP_BLAST_API_KEY}`;

  try {
    const { data } = await axios.post(url, {
      jsonrpc: '2.0',
      id: 0,
      method,
      params,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    ({ result } = data);
  } catch (e) {
    console.warn('Error calling Blast API', e);
  }

  return result;
}
