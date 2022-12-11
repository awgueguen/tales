import { privateInstance } from "@services/axios.instance";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ROOMPART_URL = {
    add : `${API_URL}/api/triggers/submit/`,
    by_room: (roomId) => `${API_URL}/api/triggers?room_id=${roomId}`,
};

export const submitTriggers = async ( token, body ) => {
    // `http://127.0.0.1:8000/api/triggers/submit/`
    const response = await privateInstance(token).post(ROOMPART_URL.add, body);
    return response.data;
};

export const getRoomTriggers = async (token, roomId) => {
    // `http://127.0.0.1:8000/api/triggers?room_id=${roomId}`
    const response = await privateInstance(token).get(ROOMPART_URL.by_room(roomId));
    return response.data;
}