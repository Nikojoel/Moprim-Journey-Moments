import React from 'react'
import storage from '@react-native-firebase/storage';

const MEDIA_PATH = "/Media/"

const getUrl = async (id) => {
    return await storage()
        .ref(MEDIA_PATH + id)
        .getDownloadURL()
}

export default {
    getUrl
}
