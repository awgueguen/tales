import {instance} from '@services/axios.instance';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ROOMS_URL = {
    plain : "http://localhost:8000/api/room/homepage",
    by_room_id : (roomId) => `${API_URL}/api/room-${roomId}`,
    create : `${API_URL}/api/room/create/`,
    quick_acces : `${API_URL}/api/room/quick_access`,
};

export const getQuickAccesRooms = async (token) => {
    // "http://localhost:8000/api/room/quick_access";
    const response = await instance(token).get(ROOMS_URL.quick_acces);
    return response.data;
}

export const createRoom = async (token, body) => {
    // http://127.0.0.1:8000/api/room/create/
    const response = await instance(token).post(ROOMS_URL.create, body);
    return response.data;
}

export const getUserRooms = async (token) => {
    // http://localhost:8000/api/room/homepage
    const response = await instance(token).get(ROOMS_URL.plain);
    return response.data;
}

export const getRoomById = async (token, roomId) => {
    // http://localhost:8000/api/assets/stories/${user_id}
    const response = await instance(token).get(ROOMS_URL.by_room_id(roomId));
    return response.data;
}