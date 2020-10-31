import React, {useState, useEffect} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native'
import MoprimBridge from '../modules/Moprim';
import LoginService from '../services/LoginService'
import Colors from '../values/Colors'
import DatabaseService from "../services/DatabaseService"
import Notification from "../components/Notification";

const Login = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [regEmail, regSetEmail] = useState('')
  const [regPwd, regSetPwd] = useState('')
  const [name, regSetName] = useState('')
  const [toggleForm, setForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const user = LoginService.getCurrentUser()
    if (user) {
      console.log(user.uid)
      MoprimBridge.initMoprim(user.uid)
      navigation.navigate('tabs')
    }
  }, [])

  const onAuthCreateUser = async (username, password) => {
    try {
      const result = await LoginService.createUser(username, password)
      console.log(result)

      const json = {
        "username": name,
        "email": result.user.email,
        "metadata": {
          "creationTime": result.user.metadata.creationTime,
          "lastSignInTime": result.user.metadata.lastSignInTime
        },
        "photoURL": "undefined",
        "id": result.user.uid,
        "rating": 0
      }
      await DatabaseService.dbUserINSERT(json)
      navigation.navigate('tabs')
    } catch (e) {
      console.log(e)
      setErrorMessage("Error in registering")
    }
  }

  const onAuthLoginUser = async (username, password) => {
    try {
      await LoginService.loginUser(username, password)
      navigation.navigate('tabs')
    } catch (e) {
      console.log(e)
      setErrorMessage("Error in login")
    }
  }

  const onAuthSignOut = async () => {
    try {
      await LoginService.logoutUser()
    } catch (e) {
      console.log(e)
      setErrorMessage("Error in logout")
    }
  }

  return (
      <View style={styles.container}>
        <Notification message={errorMessage}/>
        <Text style={styles.logo}>JourneyMoments</Text>
        <Button
            title="LOGOUT"
            onPress={async () => {
              await onAuthSignOut()
            }}
        />
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
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
            {/* TODO: Able to recover password */}
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.loginBtn}
              onPress={async () => {
                if (email.length > 1 && pwd.length > 1) {
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
          <TouchableOpacity
              style={styles.loginBtn}
              onPress={async () => {
                if (regEmail.length > 1 && regPwd.length > 1) {
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
