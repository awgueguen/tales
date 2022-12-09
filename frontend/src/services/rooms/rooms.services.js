import {privateInstance} from '@services/axios.instance'

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ROOMS_URL = {
    plain : "http://localhost:8000/api/room/homepage",
    by_user_id : (user_id) => `${API_URL}/api/assets/stories/${user_id}`,
    by_room_id : (room_id) => `${API_URL}/api/assets/stories/${room_id}`,
    create : `${API_URL}/api/room/create/`,
    quick_acces : `${API_URL}/api/room/quick_access`,
};

export const getQuickAccesRooms = async (token) => {
    // "http://localhost:8000/api/room/quick_access";
    const response = await privateInstance(token).get(ROOMS_URL.quick_acces)
    return response.data
}

export const createRoom = async (token, body) => {
    // http://127.0.0.1:8000/api/room/create/
    const response = await privateInstance(token).post(ROOMS_URL.create, body)
    return response.data
}

export const getUserRooms = async (token) => {
    // http://localhost:8000/api/room/homepage
    const response = await privateInstance(token).get(ROOMS_URL.plain)
    return response.data
}