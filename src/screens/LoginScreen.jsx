import React, {useState} from 'react';
import {TextInput, View, Button, Text} from 'react-native';

import {customFetch} from '../utils';
import useToken from '../features/useToken';
import {AuthContext} from '../features/AuthContext';
import styles from '../styles';

const url = '/login';

const LoginScreen = ({navigation, route}) => {
  //const {setToken, loading} = useToken();

  const {signIn} = React.useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (email, password) => {
    const data = {email, geslo: password};
    try {
      const response = await customFetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data,
      });
      console.log(response.data);
      const token = JSON.stringify(response.data);
      //setToken(token);
      signIn(token);
      return null;
    } catch (error) {
      if (error?.response?.status === 401) {
        console.log(error?.response?.data);
      } else if (error?.response?.data?.error?.message) {
        console.log(error?.response?.data?.error?.message);
      } else {
        console.log('There is error', error);
      }
      return null;
    }
  };

  return (
    <>
      <View style={styles.appTitleContainer}>
        <Text style={styles.appTitle}>TimeTracker</Text>
      </View>
      <View style={styles.loginContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Sign in"
            onPress={() => handleLogin(email, password)}
            color="#deb887"
          />
        </View>
      </View>
    </>
  );
};

export default LoginScreen;
