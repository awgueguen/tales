import {privateInstance} from '@services/axios.instance'

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const MESSAGES_URL = {
    plain : "http://localhost:8000/api/room/homepage",
    by_user_id : (user_id) => `${API_URL}/api/assets/stories/${user_id}`,
    by_room_id : (roomId) => `${API_URL}/api/room-${roomId}/messages`,
    create : `${API_URL}/api/room/create/`,
    quick_acces : `${API_URL}/api/room/quick_access`,
};

export const getRoomMessages = async (token, roomId) => {
    'http://localhost:8000/api/room-${roomId}/messages'
    const response = await privateInstance(token).get(MESSAGES_URL.by_room_id(roomId));
    return response.data
}