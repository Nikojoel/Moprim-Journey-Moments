import React from 'react'
import storage from '@react-native-firebase/storage';

const getUrl = async (id) => {
    return await storage()
        .ref(`/Media/${id}`)
        .getDownloadURL()
}

export default {
    getUrl
}