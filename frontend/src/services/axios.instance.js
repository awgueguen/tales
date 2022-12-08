import axios from 'axios';

// doc axios https://axios-http.com/fr/docs/req_config

// charger les env_var
const API_URL = process.env.REACT_APP_API_ENDPOINT;



// need to ifgure out how to add cancel token and get fresh tokens on cancels ..
// export const cancelTokenSource = axios.CancelToken.source();

export const privateInstance = ( token ) => 
   axios.create({
      baseURL: API_URL,
      headers: {
         "Content-type": "Application/json",
         "Authorization" : `Bearer ${token}`,
      },
   });

export const publicInstance = () => 
   axios.create({
      baseURL: API_URL,
      headers: {
         "Content-type": "Application/json",
      },
});