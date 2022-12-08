import instance from "@services/axios.instance";

const URL = {
    plain : "http://localhost:8000/api/assets/stories/",
    by_user_id : (user_id) => `http://localhost:8000/api/assets/stories/${user_id}`,
    by_room_id : (room_id) => `http://localhost:8000/api/assets/stories/${room_id}`
};

export const get_stories = async () => {
    const response = await instance(true).get(URL.plain)
    return response.data
}

export const get_user_stories = async (user_id) => {
    const response = await instance(true).get(URL.by_user_id(user_id))
    return response.data
}