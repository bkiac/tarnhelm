import axios from 'axios';

import config from '../config';

export default (): typeof axios => {
  axios.defaults.baseURL = config().uri.http;
  return axios;
};
