import {privateInstance} from "@services/axios.instance";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const STORIES_URL = {
    plain : `${API_URL}/api/assets/stories/`,
    by_user_id : (user_id) => `${API_URL}/api/assets/stories/${user_id}`,
    by_room_id : (room_id) => `${API_URL}/api/assets/stories/${room_id}`
};

export const getStories = async (token) => {
    const response = await privateInstance(token).get(STORIES_URL.plain)
    return response.data
}

export const getUserStories = async (user_id, token) => {
    const response = await privateInstance(token).get(URL.by_user_id(user_id))
    return response.data
}