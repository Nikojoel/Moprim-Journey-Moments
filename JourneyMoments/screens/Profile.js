import React, {useState, useEffect} from 'react'
import {Text, View, Button, BackHandler, Image, TextInput, StyleSheet, Alert} from 'react-native'
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Helper from "../helpers/Helper"
import DownloadService from "../services/DownloadService"
import RNBottomActionSheet from "react-native-bottom-action-sheet"
import ImagePicker from "react-native-image-picker"
import Icon from "react-native-vector-icons";

const cameraIcon = <Icon family={'FontAwesome'} name={'camera'} color={'#000000'} size={30}/>
const libraryIcon = <Icon family={'FontAwesome'} name={'photo'} color={'#000000'} size={30}/>

const Profile = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const id = LoginService.getCurrentUser().uid
    const [toggle, setToggle] = useState(false)
    const [username, setUserName] = useState([])
    const [image, setImage] = useState(null)
    const [uri, setUri] = useState(null)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        getProfile(id)
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Home")
        })
    }, [])

    const getProfile = async (userId) => {
        const result = await DatabaseService.dbUserGET("/" + userId)
        setData(Helper.parseJSON(result))
        setUserName(data.username)
        setCurrent(data.photoURL)
        setLoading(false)
    }

    const handleSend = async () => {
        let url
        if (uri) {
            const result = await handleURL(uri)
            if (result) {
                url = result

            }
        } else if (!uri) {
            url = current
        }
        const data = {
            username: username,
            photoURL: url
        }

        await DatabaseService.dbUserProfileUPDATE(id, data)
        setToggle(false)
        setImage(null)
        getProfile(id)
    }

    const handleURL = async (uri) => {
        const task = await DownloadService.dlINSERT(uri)

        if (task.state === "success") {
            const UUID = task.metadata.fullPath.split("/")[1]
            return await DownloadService.dlGetURL(UUID)
        }
    }

    const imageOptions = {
        storageOptions: {
            skipBackup: true,
            path: "images"
        }
    }

    const showAlert = () => {
        Alert.alert(
            "Warning",
            "Choosing Google Photos might not work properly",
            [
                {
                    text: "Proceed",
                    onPress: () => launchFiles()
                },
                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            { cancelable: false }
        )
    }

    const pickImage = () => {
        const sheetView = RNBottomActionSheet.SheetView

        sheetView.Show({
            title: "Choose format",
            items: [
                {title: "Image", value: "image", subTitle: "Image description", icon: cameraIcon},
                {title: "Gallery", value: "image", subTitle: "Gallery description", icon: libraryIcon},
            ],
            theme: "light",
            selection: 3,
            onSelection: (index) => {
                if (index === 0) {
                    console.log("image")
                    launchCamera(imageOptions)
                } else if (index === 1) {
                    console.log("gallery")
                    showAlert()
                }
            }
        })
    }

    const launchCamera = (options) => {
        ImagePicker.launchCamera(options, (response => {
            if (response.didCancel) {
                console.log('cancel')
            } else if (response.error) {
                console.log('error')
            } else {
                console.log('success, uri:', response.uri)
                setImage(response.uri)
                setUri(response.uri)
            }
        }))
    }

    const launchFiles = () => {
        ImagePicker.launchImageLibrary(imageOptions, (response => {
            if (response.didCancel) {
                console.log('cancel')
            } else if (response.error) {
                console.log('error')
            } else {
                console.log('success, uri:', response.uri)
                setImage(response.uri)
                setUri(response.uri)
            }
        }))
    }

    if (loading) {
        return <ProgressBar/>
    }

    if (toggle) {
        return (
            <View>
                <TextInput
                    maxLength={15}
                    placeholder="New username"
                    style={styles.input}
                    placeholderTextColor="#003f5c"
                    onChangeText={(text) => setUserName(text)}
                />
                <View>
                    <Text>Select a new profile picture</Text>
                    <Button
                        title="Picture"
                        onPress={() => {
                            pickImage();
                        }}
                    />
                    {image && <>
                        <View>
                            <Text>Selected picture</Text>
                            <Image source={{uri: image}} style={{width: 100, height: 100}}/>
                        </View>
                    </>}
                </View>
                <Button title="Update" onPress={() => handleSend()}/>
                <Button title="Go back" onPress={() => setToggle(false)}/>
            </View>
        )
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
        <Button title="Settings" onPress={() => setToggle(true)}/>
        <Button title="Logout" onPress={async () => {
            await LoginService.logoutUser()
            navigation.navigate("Login")
        }}/>
    </View>
)
}
const styles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 10,
}
})

export default Profile
