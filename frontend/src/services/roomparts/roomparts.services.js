import { instance } from "@services/axios.instance";

const ROOMPART_URL = {
    // plain : `API_URL/api/roompart/list/${roomId}`,
    by_room : (roomId) => `api/roompart/list/${roomId}`
};

export const getRoomParticipants = async ( token, roomId ) => {
    // `http://127.0.0.1:8000/api/roompart/list/${roomId}`
    const response = await instance(token).get(ROOMPART_URL.by_room(roomId))
    return response.data
};