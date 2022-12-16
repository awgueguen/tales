import { instance } from "@services/axios.instance";

const PROFILES_URL = {
    plain : `api/profile/`,
    edit: `api/profile/edit/`,
    update_activity: `api/profile/update-activity`,
};

export const getUserProfile = async (token) => {
    // `http://127.0.0.1:8000/api/profile/`
    const response = await instance(token).get(PROFILES_URL.plain);
    return response.data;
}

export const editProfile = async ( token, body ) => {
    // `http://127.0.0.1:8000/api/profile/edit/`
    const response = await instance(token).put(PROFILES_URL.edit, body);
    return response.data;
};

export const updateLastActivity = async ( token, last_activity ) => {
    // `http://localhost:8000/api/profile/update-activity`
    const response = await instance(token).put(PROFILES_URL.update_activity, last_activity)
    return response.data
}