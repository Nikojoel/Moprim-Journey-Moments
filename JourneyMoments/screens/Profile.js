import React, {useState, useEffect} from 'react'
import {Text,BackHandler, Image, TextInput, StyleSheet, Alert, Dimensions, TouchableOpacity, View} from 'react-native'
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Helper from "../helpers/Helper"
import DownloadService from "../services/DownloadService"
import RNBottomActionSheet from "react-native-bottom-action-sheet"
import ImagePicker from "react-native-image-picker"
import {Container, Icon,Body, CardItem, Card, Content, H2} from "native-base"
import Colors from "../values/Colors";

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
        setLoading(true)
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
        maxHeight: 500,
        maxWidth: 500,
        quality: 0.8,
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
                {title: "Image", value: "image", subTitle: "Image description", icon: <Icon family={'FontAwesome'} name={'camera'} color={'#000000'} size={30} />},
                {title: "Gallery", value: "image", subTitle: "Gallery description", icon: <Icon family={'FontAwesome'} name={'photo'} color={'#000000'} size={30} />},
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
        return <ProgressBar style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: 100,
            height: 100,
            color: Colors.primaryColor,
        }}/>
    }

    if (toggle) {
        return (
            <Container>
                <Content>
                    <View style={styles.card}>
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
                    </View>
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <View style={styles.card}>
                    <CardItem>
                        <Body>
                            <Image source={{uri: data.photoURL}}
                                style={styles.picture}
                            />
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Icon name='ios-person' style={styles.profileIcon}/>
                        <Text style={styles.info}>Username: {data.username}</Text>
                    </CardItem>
                    <CardItem>
                        <Icon family={'FontAwesome'} name={'mail'} color={'#000000'} size={30}/>
                            <Text style={styles.info}>Email: {data.email}</Text>
                    </CardItem>
                    <CardItem>
                        <Icon family={'FontAwesome'} name={'star'} color={'#000000'} size={30}/>
                        <Text style={styles.info}>Annotations: {data.rating}</Text>
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
            </View>
            </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    picture: {
        width: windowWidth * 0.7,
        borderRadius: 140,
        height: windowHeight * 0.35,
        alignSelf: 'center',
    },
    card: {
        alignItems: 'center',
        height: '100%'
    },
    btn: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
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
    },
    btnAccent: {
        width: '80%',
        backgroundColor: Colors.accent,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    text: {
        color: Colors.white,
    },
    selectedPic: {
        width: "80%",
        height: windowHeight * 0.4,
        borderRadius: 10
    },
    submitBtn: {
        backgroundColor: "rgba(32,222,36,0.76)"
    },
    profileIcon: {
        fontSize: 30,
    },
    info: {
        fontSize: 18,
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
        width: "80%",
        borderRadius: 25,
        borderStyle: "solid",
        borderWidth: 1,
        marginTop: 20,
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
