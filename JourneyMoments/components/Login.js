import React, {useEffect, useState} from 'react'
import {Text, View, Button} from 'react-native'
import auth from '@react-native-firebase/auth'
import LoginService from "../services/LoginService"

const Login = () => {

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null)

    // Called whenever auth state changes
    const onAuthStateChanged = (user) => {
        console.log(user)
        setUser(user)
        if (initializing) setInitializing(false)
    }

    const onAuthCreateUser = async (username, password) => {
        await LoginService.createUser(username, password)
    }

    const onAuthLoginUser = async (username, password) => {
        await LoginService.loginUser(username, password)
    }

    const onAuthSignOut = async () => {
        await LoginService.logoutUser()
    }

    // Subscribe
    useEffect(() => {
        return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);

    if (initializing) return null

    if (!user) {
        return (
            <View>
                <Button
                    title="Login"
                    onPress={async () => {
                        await onAuthLoginUser("doo.daa@example.com", "secret")
                    }}/>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
            <Button
                title="Logout"
                onPress={async () => {
                    await onAuthSignOut()
                }}/>
        </View>
    );
}

export default Login