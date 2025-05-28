import axios from 'axios';

export const getUserOperationStatus = async (
  chainId: number,
  userOpHash: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const url = `https://rpc.etherspot.io/v2/${chainId}?api-key=${process.env.REACT_APP_ETHERSPOT_DATA_API_KEY}`;

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
};
