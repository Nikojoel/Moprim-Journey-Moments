import React from 'react';
import auth from '@react-native-firebase/auth';

const createUser = async (username, password) => {
    await auth().createUserWithEmailAndPassword(username, password)
        .catch(e => {
            console.log(`Error in user creation ${e}`)
        })
}

const loginUser = async (username, password) => {
    await auth().signInWithEmailAndPassword(username, password)
        .catch(e => {
            console.log(`Error in login ${e}`)
        })
}

const logoutUser = async () => {
    await auth().signOut()
        .catch(e => {
            console.log(`Error in logging out ${e}`)
        })
}

export default {
    logoutUser,
    loginUser,
    createUser
}