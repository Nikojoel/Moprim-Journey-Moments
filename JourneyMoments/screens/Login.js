import React, {useState, useEffect} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button, BackHandler, Image, Alert,
    ImageBackground,
} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import LoginService from '../services/LoginService'
import Colors from '../values/Colors'
import DatabaseService from "../services/DatabaseService"
import Notification from "../components/Notification"
import Helper from "../helpers/Helper"
import DownloadService from "../services/DownloadService"
import RNBottomActionSheet from "react-native-bottom-action-sheet"
import ImagePicker from "react-native-image-picker"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import {Icon} from "native-base"

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
    const [validEmailReg, setValidEmailReg] = useState(true)
    const [validUsername, setValidUsername] = useState(true)
    const [validPassword, setValidPassword] = useState(true)

    const dummy = Helper.dummy

    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const userReg = /^(?=[a-zA-Z0-9._]{4,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/
    const passReg = /^(?=[a-zA-Z0-9._]{6,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

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
        mediaType: 'image',
        isImage: true,
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
                {title: "Image", value: "image", subTitle: "Image description", icon: <Icon family={'FontAwesome'} name={'camera'} color={'#000000'} size={30}/>},
                {title: "Gallery", value: "image", subTitle: "Gallery description", icon: <Icon family={'FontAwesome'} name={'photo'} color={'#000000'} size={30}/>},
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
                console.log(response.error)
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

    const checkInputs = () => {
        return regEmail.length !== 0 && regPwd.length !== 0 && name.length !== 0
    }

    const checkRegExp = () => {
        return emailRegExp.test(regEmail) && userReg.test(name) && passReg.test(regPwd)
    }

    const checkLoginInputs = () => {
        return email.length !== 0 && pwd.length !== 0
    }

    if (loading) return <ProgressBar/>

    return (
        <View style={styles.loginScreen}>
            <ImageBackground source={require('../images/backgroundMoprDark.jpg')} style={styles.container}>
                <Text style={styles.logo}>Journey Moments</Text>
                {!toggleForm && <>
                    <Text style={styles.logo2}>Login</Text>
                    <Notification message={errorMessage}/>
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
                            if (checkLoginInputs()) {
                                setLoading(true)
                                await onAuthLoginUser(email, pwd)
                            } else {
                                setErrorMessage("Bad input")
                            }
                        }}>
                        <Text style={styles.placeHolderColor}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setForm(true)
                            setErrorMessage(null)
                        }}>
                        <Text style={styles.secondaryText}>Not registered?</Text>
                    </TouchableOpacity>
                </>
                }
                {toggleForm && <>
                    <Text style={styles.logo2}>Register</Text>
                    <Notification message={errorMessage}/>
                    {validEmailReg ? true :
                        <Text style={styles.regWarn}>Email must be valid</Text>
                    }
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email..."
                            placeholderTextColor="#003f5c"
                            onChangeText={it => {
                                regSetEmail(it)
                            }}
                            onEndEditing={() => {
                                if (emailRegExp.test(regEmail) === true) {
                                    setValidEmailReg(true)
                                } else {
                                    setValidEmailReg(false)
                                }
                            }}
                        />
                    </View>
                    {validUsername ? true :
                        <Text style={styles.regWarn}>Username must be 4 characters long.</Text>
                    }
                    <View style={styles.inputView}>
                        <TextInput
                            maxLength={15}
                            style={styles.inputText}
                            placeholder="Username..."
                            placeholderTextColor="#003f5c"
                            onChangeText={it => {
                                regSetName(it)
                            }}
                            onEndEditing={() => {
                                if (userReg.test(name) === true) {
                                    setValidUsername(true)
                                } else {
                                    setValidUsername(false)
                                }
                            }}
                        />
                    </View>
                    {validPassword ? true :
                        <Text style={styles.regWarn}>Password must be 6 characters long.</Text>
                    }
                    <View style={styles.inputView}>
                        <TextInput
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Password..."
                            placeholderTextColor="#003f5c"
                            onChangeText={it => {
                                regSetPwd(it)
                            }}
                            onEndEditing={() => {
                                if (passReg.test(regPwd) === true) {
                                    setValidPassword(true)
                                } else {
                                    setValidPassword(false)
                                }
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.pictureBtn}
                        onPress={() => {
                            pickImage()
                        }}
                    >
                        <Text style={styles.placeHolderColor}>PICTURE</Text>
                    </TouchableOpacity>
                    {image && <>
                        <View>
                            <Text>Selected picture</Text>
                            <Image source={{uri: image}} style={{width: 100, height: 100}}/>
                        </View>
                    </>}
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={async () => {
                            if (checkInputs()) {
                                if (checkRegExp()) {
                                    await onAuthCreateUser(regEmail, regPwd)
                                } else {
                                    setErrorMessage("Check inputs")
                                }
                            } else {
                                setValidEmailReg(false)
                                setValidUsername(false)
                                setValidPassword(false)
                            }
                        }}>
                        <Text style={styles.placeHolderColor}>REGISTER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setForm(false)
                            setErrorMessage(null)
                        }}>
                        <Text style={styles.secondaryText}>Already an user?</Text>
                    </TouchableOpacity>
                </>}
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 30,
        color: Colors.backgroundGrayOp,
        marginBottom: 40,
        fontFamily: 'monospace'
    },
    logo2: {
        fontWeight: 'bold',
        fontSize: 25,
        color: Colors.backgroundGrayOp,
        marginBottom: 40,
        fontFamily: 'monospace'
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
        color: 'black',
    },
    regWarn: {
        color: 'red',
    },
    pictureBtn: {
        width: '60%',
        backgroundColor: Colors.secondaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginScreen: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryText: {
        color: 'white',
        fontSize: 16,
        marginTop: 5,
    },
    placeHolderColor: {
        color: Colors.placeHolderColor
    },
})

export default Login
