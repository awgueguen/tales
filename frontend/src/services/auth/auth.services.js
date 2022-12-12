import { instance } from '@services/axios.instance';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const AUTH_URL = {
    register : `${API_URL}/api/register/`,
    login : `${API_URL}/token/`,
    refresh: `${API_URL}/token/refresh/`,
};


export const registerUser = async (body) => {
    // 'http://localhost:8000/api/register/
    const response = await instance().post(AUTH_URL.register, body);
    return response.data;
}

export const refreshToken = async (body) => {
    // 'http://localhost:8000/token/refresh/'
    const response = await instance().post(AUTH_URL.refresh, body);
    return response;
}


export const loginUser = async (body) => {
    // 'http://localhost:8000/token/'
    const response = await instance().post(AUTH_URL.login, body);
    return response;
}