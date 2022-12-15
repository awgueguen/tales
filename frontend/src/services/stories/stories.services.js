import {instance} from "@services/axios.instance";

const STORIES_URL = {
    plain : `api/assets/stories/`,
    by_user_id : (user_id) => `api/assets/stories/${user_id}`,
    by_room_id : (room_id) => `api/assets/stories/${room_id}`
};

export const getStories = async (token) => {
    const response = await instance(token).get(STORIES_URL.plain)
    return response.data
}

export const getUserStories = async (user_id, token) => {
    const response = await instance(token).get(URL.by_user_id(user_id))
    return response.data
}