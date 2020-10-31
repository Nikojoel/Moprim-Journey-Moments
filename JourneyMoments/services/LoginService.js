import React from 'react';
import auth from '@react-native-firebase/auth';

const createUser = async (username, password) => {
    return await auth()
        .createUserWithEmailAndPassword(username, password)
}

const loginUser = async (username, password) => {
    return await auth()
        .signInWithEmailAndPassword(username, password)
}

const logoutUser = async () => {
    return await auth()
        .signOut()
}

const getCurrentUser = () => {
    return auth().currentUser;
}

export default {
    logoutUser,
    loginUser,
    createUser,
    getCurrentUser
};
