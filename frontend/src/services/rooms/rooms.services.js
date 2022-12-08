import {privateInstance} from '@services/axios.instance'

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ROOMS_URL = {
    plain : `${API_URL}/api/room/quick_access`,
    by_user_id : (user_id) => `${API_URL}/api/assets/stories/${user_id}`,
    by_room_id : (room_id) => `${API_URL}/api/assets/stories/${room_id}`
};

export const getRooms = async (token) => {
    // "http://localhost:8000/api/room/quick_access";
    const response = await privateInstance(token).get(ROOMS_URL.plain)
    return response.data
}