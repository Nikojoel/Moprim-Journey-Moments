import React, {useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginService from '../services/LoginService';
import DatabaseService from '../services/DatabaseService';

const Login = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [first, setFirst] = useState(false);

  // Called whenever auth state changes
  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (first && user) {
      console.log('bingo');
      const data = {
        username: 'undefined',
        email: user.email,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        photoURL: 'undefined',
        id: user.uid,
        rating: 0,
      };
      await DatabaseService.dbUserINSERT(data);
      setFirst(false);
    }
    if (initializing) {
      setInitializing(false);
    }
  };

  const onAuthCreateUser = async (username, password) => {
    await LoginService.createUser(username, password);
    setFirst(true);
  };

  const onAuthLoginUser = async (username, password) => {
    await LoginService.loginUser(username, password);
  };

  const onAuthSignOut = async () => {
    await LoginService.logoutUser();
    setFirst(true);
  };

  // Subscribe
  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <View>
        <Button
          title="Login"
          onPress={async () => {
            //await onAuthLoginUser("doo.daa@example.com", "secret")
            await onAuthCreateUser('kuu@jjjj.fi', 'secret');
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await onAuthSignOut();
        }}
      />
    </View>
  );
};

export default Login;
