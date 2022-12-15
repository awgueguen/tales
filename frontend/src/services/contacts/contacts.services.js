import {instance} from "@services/axios.instance";

const CONTACTS_URL = {
    plain : `api/contacts/`,
    add : `api/contacts/add/`,
    check : (input) => `api/contacts/add/?receiver=${input}`
};

export const getContacts = async ( token ) => {
    // http://localhost:8000/api/contacts/
    const response = await instance(token).get(CONTACTS_URL.plain)
    return response.data
}

export const addContact = async (token, body) => {
// http://127.0.0.1:8000/api/contacts/add/
    const response = await instance(token).post(CONTACTS_URL.add, body)
    return response
}

export const checkContactExists = async (token, input) => {
    // `http://localhost:8000/api/contacts/add/?receiver=${input}`
    const response = await instance(token).get(CONTACTS_URL.check(input))
    return response
}