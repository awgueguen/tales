import {privateInstance} from "@services/axios.instance";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const CONTACTS_URL = {
    plain : `${API_URL}/api/contacts/`,
    add : `${API_URL}/api/contacts/add/`,
    check : (input) => `${API_URL}/api/room/quick_access?receiver=${input}`
};

export const getContacts = async ( token ) => {
    // http://localhost:8000/api/contacts/
    const response = await privateInstance(token).get(CONTACTS_URL.plain)
    return response.data
}

export const addContact = async (token, body) => {
// http://127.0.0.1:8000/api/contacts/add/
    const response = await privateInstance(token).post(CONTACTS_URL.add, body)
    return response.data
}

export const checkIsFriend = async (token, input) => {
    // `http://localhost:8000/api/room/quick_access?receiver=${input}`
    const response = await privateInstance(token).get(CONTACTS_URL.check(input))
    return response.data
}