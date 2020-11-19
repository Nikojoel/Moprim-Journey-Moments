import React, {useState, useEffect} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button, BackHandler, Image, Alert
} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import LoginService from '../services/LoginService'
import Colors from '../values/Colors'
import DatabaseService from "../services/DatabaseService"
import Notification from "../components/Notification"
import Helper from "../helpers/Helper";
import DownloadService from "../services/DownloadService";
import RNBottomActionSheet from "react-native-bottom-action-sheet";
import ImagePicker from "react-native-image-picker";
import {ProgressBar} from "@react-native-community/progress-bar-android";
import Icon from "react-native-vector-icons";

const cameraIcon = <Icon family={'FontAwesome'} name={'camera'} color={'#000000'} size={30}/>
const libraryIcon = <Icon family={'FontAwesome'} name={'photo'} color={'#000000'} size={30}/>

const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [regEmail, regSetEmail] = useState('')
    const [regPwd, regSetPwd] = useState('')
    const [name, regSetName] = useState('')
    const [toggleForm, setForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const user = LoginService.getCurrentUser()
    const [image, setImage] = useState(null)
    const [uri, setUri] = useState(null)
    const [loading, setLoading] = useState(false)

    const dummy = Helper.dummy

    useEffect(() => {
        if (user) {
            MoprimBridge.initMoprim(user.uid)
            navigation.navigate('tabs')
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
    }, [])

    const onAuthCreateUser = async (username, password) => {
        try {
            const result = await LoginService.createUser(username, password)
            MoprimBridge.initMoprim(result.user.uid)

            let url
            if (uri) {
                const result = await handleURL(uri)
                if (result) {
                    url = result

                }
            } else if (!uri) {
                url = dummy
            }

            const json = {
                "username": name,
                "email": result.user.email,
                "metadata": {
                    "creationTime": result.user.metadata.creationTime,
                    "lastSignInTime": result.user.metadata.lastSignInTime
                },
                "photoURL": url,
                "id": result.user.uid,
                "rating": 0
            }

            await DatabaseService.dbUserINSERT(json)
            setLoading(false)
            navigation.navigate('tabs')
            setImage(null)
            setUri(null)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setErrorMessage("Error in registering")
        }
    }

    const onAuthLoginUser = async (username, password) => {
        try {
            const user = await LoginService.loginUser(username, password)
            MoprimBridge.initMoprim(user.user.uid)
            setLoading(false)
            navigation.navigate('tabs')
        } catch (e) {
            setLoading(false)
            console.log(e)
            setErrorMessage("Error in login")
        }
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

    if (loading) return <ProgressBar/>

    return (
        <View style={styles.container}>
            <Notification message={errorMessage}/>
            <Text style={styles.logo}>JourneyMoments</Text>
            {!toggleForm && <>
                <Text style={styles.logo}>Login</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email..."
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..."
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setPwd(text)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={async () => {
                        if (email.length > 1 && pwd.length > 1) {
                            setLoading(true)
                            await onAuthLoginUser(email, pwd)
                        } else {
                            setErrorMessage("Bad input")
                        }
                    }}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setForm(true)
                    }}>
                    <Text style={styles.loginText}>Not registered?</Text>
                </TouchableOpacity>
            </>
            }
            {toggleForm && <>
                <Text style={styles.logo}>Register</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email..."
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => regSetEmail(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Username..."
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => regSetName(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..."
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => regSetPwd(text)}
                    />
                </View>
                <View>
                    <Text>Select a profile picture</Text>
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
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={async () => {
                        if (regEmail.length > 1 && regPwd.length > 1) {
                            setLoading(true)
                            await onAuthCreateUser(regEmail, regPwd)
                        } else {
                            setErrorMessage("Bad input")
                        }
                    }}>
                    <Text style={styles.loginText}>REGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setForm(false)
                    }}>
                    <Text style={styles.loginText}>Already an user?</Text>
                </TouchableOpacity>
            </>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 30,
        color: Colors.primaryColor,
        marginBottom: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: Colors.backgroundGray,
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: 'white',
    },
    forgot: {
        color: 'white',
        fontSize: 11,
    },
    loginBtn: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: Colors.white,
    },
})

export default Login
