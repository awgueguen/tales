import { instance } from "@services/axios.instance";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const CHARACTERS_URL = {
    plain : `${API_URL}/api/characters/`,
};

export const getCharacters = async ( token ) => {
    // `http://127.0.0.1:8000/api/roompart/list/${roomId}`
    const response = await instance(token).get(CHARACTERS_URL.plain)
    return response.data
};