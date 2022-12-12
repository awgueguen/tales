import axios from 'axios';

// doc axios https://axios-http.com/fr/docs/req_config
const API_URL = process.env.REACT_APP_API_ENDPOINT;

// need to ifgure out how to add cancel token and get fresh tokens on cancels ..
// export const cancelTokenSource = axios.CancelToken.source();

// TODO -> eventually add interceptors for authorization on delimited routes
export const instance = ( token ) => 
   axios.create({
      baseURL: API_URL,
      headers: {
         "Content-type": "Application/json",
         "Authorization" : token ? `Bearer ${token}` : "",
      },
   });