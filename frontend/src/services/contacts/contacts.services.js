import {instance} from "@services/axios.instance";

const CONTACTS_URL = {
    plain : `api/contacts/`,
    add : `api/contacts/add/`,
    remove: `api/contacts/remove/`,
    sent_ : `api/contacts/sent/`,
    wait_ : `api/contacts/waiting/`,
    accept : `api/contacts/accept/`,
};

export const getContacts = async ( token ) => {
    // http://localhost:8000/api/contacts/
    // TODO ADD status logic in here (fdrom EditProfile)
    const response = await instance(token).get(CONTACTS_URL.plain)
    return response.data
}

export const getSentContacts = async ( token ) => {
    // http://localhost:8000/api/contacts/sent/
    const response = await instance(token).get(CONTACTS_URL.sent_)
    return response.data
}

export const getWaitingContacts = async ( token ) => {
    // http://localhost:8000/api/contacts/waiting/
    const response = await instance(token).get(CONTACTS_URL.wait_)
    return response.data
}

export const addContact = async (token, body) => {
// http://127.0.0.1:8000/api/contacts/add/
    const response = await instance(token).post(CONTACTS_URL.add, body)
    return response
}

export const removeContact = async (token, body) => {
    // http://127.0.0.1:8000/api/contacts/remove/
    const response = await instance(token).put(CONTACTS_URL.remove, body)
    return response.data
}


export const acceptContact = async (token, body) => {
    // http://127.0.0.1:8000/api/contacts/accept/
    const response = await instance(token).put(CONTACTS_URL.accept, body)
    return response.data
}