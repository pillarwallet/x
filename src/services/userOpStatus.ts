import axios from 'axios';

export const getUserOperationStatus = async (
  chainId: number,
  userOpHash: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | undefined> => {
  const apiKey = process.env.REACT_APP_ETHERSPOT_DATA_API_KEY;

  if (!chainId) {
    console.error('getUserOperationStatus: chainId is required');
    return undefined;
  }

  if (!apiKey) {
    console.error('getUserOperationStatus: API key is missing');
    return undefined;
  }

  const url = `https://rpc.etherspot.io/v2/${chainId}?api-key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        method: 'skandha_userOperationStatus',
        params: [userOpHash],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error(
      'getUserOperationStatus: Failed to fetch user operation status',
      error
    );
    return undefined;
  }
};
