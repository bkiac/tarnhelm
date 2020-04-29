import axios from 'axios';

import config from '../config';

export default function setupAxios(): typeof axios {
  axios.defaults.baseURL = config().server.origin.http;
  return axios;
}
