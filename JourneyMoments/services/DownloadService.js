import React from 'react'
import storage from '@react-native-firebase/storage';
import Helper from "../helpers/Helper";

const MEDIA_PATH = "/Media/"
const STORAGE_PATH = "Media/"

const dlGetURL = async (id) => {
    return await storage()
        .ref(MEDIA_PATH + id)
        .getDownloadURL()
}

const dlINSERT = (uri) => {
    const UUID = Helper.generateUUID()
    return storage()
        .ref(STORAGE_PATH + UUID)
        .putFile(uri)
}

export default {
    dlGetURL,
    dlINSERT
}
