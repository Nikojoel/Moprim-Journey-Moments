import React, {useState, useEffect} from 'react'
import {Text,BackHandler, Image, TextInput, StyleSheet, Alert, Dimensions, TouchableOpacity} from 'react-native'
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Helper from "../helpers/Helper"
import DownloadService from "../services/DownloadService"
import RNBottomActionSheet from "react-native-bottom-action-sheet"
import ImagePicker from "react-native-image-picker"
import Icons from "react-native-vector-icons"
import {Container, Icon,Body, CardItem, Card, Content, H2} from "native-base"
import Colors from "../values/Colors";

const cameraIcon = <Icons family={'FontAwesome'} name={'camera'} color={'#000000'} size={30}/>
const libraryIcon = <Icons family={'FontAwesome'} name={'photo'} color={'#000000'} size={30}/>
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

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
            {cancelable: false}
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
            <Container>
                <Content>
                    <Card>
                        <TextInput
                            maxLength={15}
                            placeholder="New username"
                            style={styles.input}
                            placeholderTextColor="grey"
                            onChangeText={(text) => setUserName(text)}
                        />
                            <TouchableOpacity style={styles.btn} onPress={() => pickImage()}>
                                <Text style={styles.text}>IMAGE</Text>
                            </TouchableOpacity>
                        <Body>
                            {image && <>
                                <H2>Selected image</H2>
                                <CardItem>
                                    <Image style={styles.selectedPic} source={{uri: image}}/>
                                </CardItem>
                            </>}
                        </Body>
                                <TouchableOpacity style={styles.btnAction} onPress={() => handleSend()}>
                                    <Text style={styles.text}>UPDATE</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnAccent} onPress={() => setToggle(false)}>
                                    <Text style={styles.text}>BACK</Text>
                                </TouchableOpacity>
                    </Card>
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem bordered>
                        <Icon name='ios-person' style={styles.profileIcon}/>
                        <Text style={styles.info}>Username: {data.username}</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Image
                                style={styles.profilePic}
                                source={{uri: data.photoURL}}
                            />
                        </Body>
                    </CardItem>
                    <CardItem bordered>
                        <Icon name='ios-document' style={styles.profileIcon}/>
                        <Body>
                            <Text style={styles.info}>Email: {data.email}</Text>
                            <Text style={styles.info}>Rating: {data.rating}</Text>
                        </Body>
                    </CardItem>
                        <TouchableOpacity style={styles.btn} onPress={() => setToggle(true)}>
                            <Text style={styles.text}>SETTINGS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAccent} onPress={async () => {
                            await LoginService.logoutUser()
                            navigation.navigate("Login")
                        }}>
                            <Text style={styles.text}>LOGOUT</Text>
                        </TouchableOpacity>
                </Card>
            </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    btn: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: windowWidth * 0.1
    },
    btnAction: {
        width: '80%',
        backgroundColor: Colors.secondaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: windowWidth * 0.1
    },
    btnAccent: {
        width: '80%',
        backgroundColor: Colors.accent,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: windowWidth * 0.1
    },
    text: {
        color: Colors.white,
    },
    profilePic: {
        width: '100%',
        height: windowHeight * 0.5,
    },
    selectedPic: {
        width: "80%",
        height: windowHeight * 0.5,
    },
    submitBtn: {
        backgroundColor: "rgba(32,222,36,0.76)"
    },
    profileIcon: {
        fontSize: 30,
    },
    info: {
        fontSize: 16,
    },
    myPostsIcon: {
        marginRight: 10,
    },
    logoutIcon: {
        marginLeft: 10,
    },
    btnStyle: {
        width: 70
    },
    border: {
        borderColor: 'transparent',
    },
    iconSize: {
        fontSize: 30,
    },
    input: {
        width: "100%",
        borderRadius: 25,
        borderStyle: "solid",
        borderWidth: 1,
    },
    slider: {
        width: 300,
        height: 40,
    },
    image: {
        width: windowWidth * 0.2,
        height: windowHeight * 0.09,
    },
})

export default Profile
