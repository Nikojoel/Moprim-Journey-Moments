import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import LoginService from '../services/LoginService'
import Colors from '../values/Colors'

const Login = ({ navigation }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  // Called whenever auth state changes
  const onAuthStateChanged = (user) => {
    console.log(user)
    setUser(user)
    if (initializing) {
      setInitializing(false)
    }
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
    return auth().onAuthStateChanged(onAuthStateChanged) // unsubscribe on unmount
  }, [user])

  if (initializing) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>JourneyMoments</Text>
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
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={async () => {
          await onAuthLoginUser(email, pwd)
        }}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await onAuthLoginUser('doo.daa@example.com', 'secret')
          navigation.navigate('tabs')
        }}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>
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

/*<View>
    <Button
        title="Login"
        onPress={async () => {
            await onAuthLoginUser('doo.daa@example.com', 'secret');
        }}
    />
</View>*/
