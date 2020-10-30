import React from 'react'
import database from '@react-native-firebase/database'

const USER_PATH = "/Users/"
const USER_ID_PATH = "/Users"
const MEDIA_PATH = "/Media/"
const TRAVEL_PATH = "/Chain/"

// Get all = "/"
// Get single = "id"
const dbUserGET = async (id) => {
    const result = await database()
        .ref(USER_ID_PATH + id)
        .once("value")
    console.log("dbUserGET: ", result.toJSON())
    return result
}

// Insert single user = Data in JSON
const dbUserINSERT = async (data) => {
    const ref = database().ref(USER_PATH + data.id)
    await ref.set(data)
    console.log("user in insert: ", data)
    console.log("dbUserINSERT: ", data)
}

// Update user rating = User id
const dbUserUPDATE = async (id) => {
    const ref = database().ref(USER_ID_PATH + id).key
    console.log(ref)
    const single = await dbUserGET("/" + ref)
    const rating = single.val().rating + 1
    console.log("rating: ", single.val().rating)

        await database()
            .ref(USER_ID_PATH + id)
            .update({
                rating: rating
            })
    console.log("dbUserUPDATE: ")
}

export default {
    dbUserGET,
    dbUserINSERT,
    dbUserUPDATE,
}