import axios from 'axios';

// charger les env_var
const API_URL = "";

/**
 * @param {Boolean} needAuth wether the request need authorization
 * @param {String} contentType type of the request content
 * @returns {AxiosInstance}
 */
export const instance = (needAuth, contentType='application/json') => axios.create({
   baseURL: API_URL,
   headers: {
      'Content-type': contentType,
   },
   withCredentials: needAuth
});
