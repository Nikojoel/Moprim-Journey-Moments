import React, {useState, useEffect} from 'react'
import {Text, View, Button, BackHandler, Image} from 'react-native'
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Helper from "../helpers/Helper";

const Profile = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const id = LoginService.getCurrentUser().uid

    useEffect(() => {
        const getProfile = async (userId) => {
            const result = await DatabaseService.dbUserGET("/" + userId)
            setData(Helper.parseJSON(result))
            console.log(data)
            setLoading(false)
        }
        getProfile(id)
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Home")
        })
    }, [])

    if (loading) {
        return <ProgressBar/>
    }

    return (
    <View>
        <Text>Profile</Text>
        <Text>name: {data.username}</Text>
        <Text>email: {data.email}</Text>
        <Text>creationTime: {data.metadata.creationTime}</Text>
        <Text>lastSignInTime: {data.metadata.lastSignInTime}</Text>
        <Text>photo: {data.photoURL}</Text>
        <Image source={{uri: data.photoURL}} style={{width: 250, height: 250}}/>
        <Text>rating: {data.rating}</Text>
        <Button title="Logout" onPress={async () => {
            await LoginService.logoutUser()
            navigation.navigate("Login")
        }}/>
    </View>
)
}

export default Profile
