import { instance } from '@services/axios.instance';

const AUTH_URL = {
    register : `api/register/`,
    login : `token/`,
    refresh: `token/refresh/`,
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