import axios from 'axios';

export const callMainApi = async <T>(urlPath: string): Promise<T | undefined> => {
  let data;

  const url = `${process.env.REACT_APP_PILLARX_SERVICES_HOST}/${urlPath}`;

  try {
    ({ data } = await axios.get(url));
  } catch (e) {
    console.warn('Error calling PillarX main API', e);
  }

  return data;
}
