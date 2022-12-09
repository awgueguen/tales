import { privateInstance } from "@services/axios.instance";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const ROOMPART_URL = {
    plain : `${API_URL}/api/triggers/submit/`,
};

export const submitTriggers = async ( token, body ) => {
    // `http://127.0.0.1:8000/api/triggers/submit/`
    const response = await privateInstance(token).post(ROOMPART_URL.by_room, body)
    return response.data
};

