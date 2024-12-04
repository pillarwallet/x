import axios from 'axios';
import publicUrl from '../constants/publicUrl';

export default axios.create({
  baseURL: publicUrl,
});
