import React, {useEffect, useState} from 'react';
import {AuthContext} from '../features/AuthContext';
import {
  Text,
  View,
  Button,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import styles from '../styles';
import {customFetch} from '../utils';

import useToken from '../features/useToken';

const ProfileScreen = ({navigation, route}) => {
  //const {token, loading, removeToken} = useToken();
  const {signOut, userToken, user} = React.useContext(AuthContext);

  console.log(userToken);

  const [userData, setUserData] = useState();

  useEffect(() => {
    customFetch(`worker/${user}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => {
        if (response.data) {
          setUserData(response.data.result);
        } else {
          ToastAndroid.show('No data found', ToastAndroid.SHORT);
          console.log('No data found..');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Failed to load profile data...', ToastAndroid.SHORT);
      });
  }, []);

  const handleLogout = async () => {
    signOut();
    removeToken();
    //navigation.navigate('Login', {screen: 'Login'});
  };

  return (
    <>
      <View style={styles.profileContainer}>
        <View style={styles.profileRowContainer}>
          <FlatList
            data={userData}
            renderItem={({item}) => {
              return (
                <View style={styles.itemContainer}>
                  <Text style={styles.profileColumnRowTxt}>{item.ime}</Text>
                  <Text style={styles.profileColumnRowTxt}>{item.priimek}</Text>
                  <Text style={styles.profileColumnRowTxt}>{item.email}</Text>
                </View>
              );
            }}
            keyExtractor={item => item.key}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <Button title="Edit Profile" color="#deb887" />
          <Button title="Change Password" color="#deb887" />
        </View>
      </View>

      <View style={styles.logoutButton}>
        <Button title="Sign Out" color="#ff6347" onPress={signOut} />
      </View>
    </>
  );
};

export default ProfileScreen;
