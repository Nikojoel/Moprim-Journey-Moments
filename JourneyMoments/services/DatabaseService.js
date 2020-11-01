import React from 'react'
import database from '@react-native-firebase/database'

const USER_ROUTE = "/Users/"
const USER_ID_ROUTE = "/Users"
const TRAVEL_ROUTE = "/Moprim/"
const MEDIA_PATH = "/Media/"

// Get all = "/"
// Get single = "id"
const dbUserGET = async (id) => {
    return await database()
        .ref(USER_ID_ROUTE + id)
        .once("value")
}

// Insert single user, data in JSON
const dbUserINSERT = async (data) => {
    return await database()
        .ref(USER_ROUTE + data.id)
        .set(data)
}

// Update user rating
const dbUserUPDATE = async (userId) => {
    const user = await dbUserGET("/" + userId)
    const rating = user.val().rating + 1
    return await database()
        .ref(USER_ROUTE + userId)
        .update({
            rating: rating
        })
}

// Get all = "/"
// Get single = "id"
const dbAllMoprimGET = async (id) => {
    return await database()
        .ref(TRAVEL_ROUTE + id)
        .once("value")
}

// Get all user travel data
const dbMoprimGET = async (userId) => {
    return await database()
        .ref(TRAVEL_ROUTE)
        .orderByChild("userId")
        .equalTo(userId)
        .once("value")
}

// Insert travel data
const dbMoprimINSERT = async (data) => {
    return await database()
        .ref(TRAVEL_ROUTE + data.id)
        .set(data)
}

// Insert media data
const dbMediaINSERT = async (data) => {
    return await database()
        .ref(MEDIA_PATH + data.id)
        .set(data)
}

export default {
    dbUserGET,
    dbUserINSERT,
    dbUserUPDATE,
    dbAllMoprimGET,
    dbMoprimINSERT,
    dbMoprimGET,
    dbMediaINSERT,
}
