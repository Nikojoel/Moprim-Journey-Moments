import React from 'react'
import database from '@react-native-firebase/database'

const USER_ROUTE = "/User/"
const USER_ID_ROUTE = "/User"
const TRAVEL_ROUTE = "/Moprim/"
const TRAVEL_ID_ROUTE = "/Moprim"
const MEDIA_ROUTE = "/Media/"
const MEDIA_ID_ROUTE = "/Media"
const COMMENT_ID_ROUTE = "/Comment"
const COMMENT_ROUTE = "/Comment/"
const TRAVEL_CHAIN_ID_ROUTE = "/Travelchain"
const TRAVEL_CHAIN_ROUTE = "/Travelchain/"
const RATE_ID_ROUTE = "/Rating"
const RATE_ROUTE = "/Rating/"

// Get all = "/"
// Get single = "/id"
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

// Insert user profile photo
const dbUserPhotoINSERT = async (id, url) => {
    return await database()
        .ref(USER_ID_ROUTE + id)
        .update({
            photoURL: url
        })
}

// Get all = "/"
// Get single = "/id"
const dbAllMoprimGET = async (id) => {
    return await database()
        .ref(TRAVEL_ID_ROUTE + id)
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

// Insert travel data, data in JSON
const dbMoprimINSERT = async (data) => {
    return await database()
        .ref(TRAVEL_ROUTE + data.id)
        .set(data)
}

// Update travel rating
const dbMoprimUPDATE = async (id, data) => {
    return await database()
        .ref(RATE_ROUTE + id)
        .set({
            id: id,
            moprimId: id,
            rating: {
                speed: data.speed,
                cleanness: data.cleanness,
                comfort: data.comfort
            }
        })
}

// Get journey rating
const dbMoprimRatingGET = async (id) => {
    return await database()
        .ref(RATE_ROUTE + id)
        .once("value")
}

// Insert media data, data in JSON
const dbMediaINSERT = async (data) => {
    return await database()
        .ref(MEDIA_ROUTE + data.id)
        .set(data)
}

// Get all = "/"
// Get single = "/id"
const dbAllMediaGET = async (id) => {
    return await database()
        .ref(MEDIA_ID_ROUTE + id)
        .once("value")
}

// Get all user media
const dbMediaGET = async (userId) => {
    return await database()
        .ref(MEDIA_ROUTE)
        .orderByChild("userId")
        .equalTo(userId)
        .once("value")
}

// Get media for specific travel chain
const dbMediaMoprimGET = async (moprimId) => {
    return await database()
        .ref(MEDIA_ROUTE)
        .orderByChild("moprimId")
        .equalTo(moprimId)
        .once("value")
}

// Get all = "/"
// Get single = "/id"
const dbAllCommentGET = async (id) => {
    return await database()
        .ref(COMMENT_ID_ROUTE + id)
        .once("value")
}

// Get all user comments
const dbCommentUserGET = async (userId) => {
    return await database()
        .ref(COMMENT_ROUTE)
        .orderByChild("userId")
        .equalTo(userId)
        .once("value")
}

// Get all travel chain comments
const dbCommentMoprimGET = async (moprimId) => {
    return await database()
        .ref(COMMENT_ROUTE)
        .orderByChild("moprimId")
        .equalTo(moprimId)
        .once("value")
}

// Insert comment data, data in JSON
const dbCommentINSERT = async (data) => {
    return await database()
        .ref(COMMENT_ROUTE + data.id)
        .set(data)
}

// Get all = "/"
// Get single = "/date" (MM_DD_YYYY format)
const dbAllTravelChainGET = async (date) => {
    return await database()
        .ref(TRAVEL_CHAIN_ID_ROUTE + date)
        .once("value")
}

// Get all user travel chains
const dbUserTravelChainGET = async (userId) => {
    return await database()
        .ref(TRAVEL_CHAIN_ROUTE)
        .orderByChild("userId")
        .equalTo(userId)
        .once("value")
}

// Get all travel chains from a set time period
// MM_DD_YYYY format
const dbTravelChainDateGET = async (start, end) => {
    return await database()
        .ref(TRAVEL_CHAIN_ROUTE)
        .orderByKey()
        .startAt(end)
        .endAt(start)
        .once("value")
}

export default {
    dbUserGET,
    dbUserINSERT,
    dbUserUPDATE,
    dbAllMoprimGET,
    dbMoprimINSERT,
    dbMoprimGET,
    dbMoprimUPDATE,
    dbMoprimRatingGET,
    dbMediaINSERT,
    dbAllMediaGET,
    dbMediaGET,
    dbMediaMoprimGET,
    dbAllCommentGET,
    dbCommentUserGET,
    dbCommentINSERT,
    dbCommentMoprimGET,
    dbUserPhotoINSERT,
    dbAllTravelChainGET,
    dbUserTravelChainGET,
    dbTravelChainDateGET,
}
