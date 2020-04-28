import axios from 'axios';

import config from '../config';

export default (): typeof axios => {
  axios.defaults.baseURL = config().server.origin.http;
  return axios;
};
