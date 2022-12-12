import {instance} from '@services/axios.instance'

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const MESSAGES_URL = {
    by_room_id : (roomId) => `${API_URL}/api/room-${roomId}/messages/`,
    create : (roomId) => `${API_URL}/api/room-${roomId}/messages/`,
};

export const getRoomMessages = async (token, roomId) => {
    // 'http://localhost:8000/api/room-${roomId}/messages/'
    const response = await instance(token).get(MESSAGES_URL.by_room_id(roomId));
    return response.data
}

export const postMessage = async (token, body) => {
    // 'http://localhost:8000/api/room-${roomId}/messages/'
    const response = await instance(token).post(MESSAGES_URL.create(body.room), body);
    return response.data;
}