import React, {useEffect, useState, useCallback} from 'react';
import {AuthContext} from '../features/AuthContext';
import {
  Text,
  View,
  Button,
  FlatList,
  ToastAndroid,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';

import styles from '../styles';
import {customFetch} from '../utils';

const ProfileScreen = ({navigation, route}) => {
  const {signOut, userToken, user} = React.useContext(AuthContext);

  const [userData, setUserData] = useState('');

  const fetchData = () => {
    customFetch(`worker/${user}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => {
        if (response.data) {
          setUserData(response.data.result);
          setLastName(response.data.result[0].priimek);
          setEmail(response.data.result[0].email);
        } else {
          ToastAndroid.show('No data found', ToastAndroid.SHORT);
          console.log('No data found..');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Failed to load profile data...', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isPassModalVisible, setPassModalVisible] = useState(false);
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const editProfile = () => {
    const data = {
      ime: user,
      priimek: lastName,
      email,
      role: userData[0]?.role,
      status: userData[0]?.status,
    };

    customFetch(`worker/${user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Profile was successfully edited!');
          ToastAndroid.show(
            'Profile was successfully edited!',
            ToastAndroid.SHORT,
          );
          fetchData();
        } else {
          ToastAndroid.show('Failed to edit profile', ToastAndroid.SHORT);
          console.log('Failed to edit profile...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Failed to edit profile', ToastAndroid.SHORT);
      });

    console.log(data);
    setProfileModalVisible(false);
  };

  const changePassword = () => {
    const data = {
      geslo: password,
      novoGeslo: newPassword,
    };
    if (data.novoGeslo === confirmPassword) {
      customFetch(`/worker/change-password/${user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        data: data,
      })
        .then(response => {
          if (response.status === 204) {
            console.log('Password was successfully changed!');
            ToastAndroid.show(
              'Password was successfully changed!',
              ToastAndroid.SHORT,
            );
            setPassModalVisible(false);
          } else {
            console.log('Failed to change password');
            ToastAndroid.show('Failed to change password', ToastAndroid.SHORT);
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            ToastAndroid.show('Wrong password!', ToastAndroid.SHORT);
            console.log('Wrong password');
          } else {
            console.log(error);
            ToastAndroid.show('Failed to change password', ToastAndroid.SHORT);
          }
        });
    } else {
      ToastAndroid.show('Passwords do not match!', ToastAndroid.SHORT);
      console.log('Passwords do not match!');
    }

    console.log(data);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchData();
  }, []);

  return (
    <>
      <View style={styles.profileContainer}>
        <View style={styles.profileRowContainer}>
          <FlatList
            data={userData}
            renderItem={({item}) => {
              return (
                <View style={styles.itemContainer}>
                  <View style={styles.profileRow}>
                    <Text style={styles.profileColumnRowLabel}>Name</Text>
                    <Text style={styles.profileColumnRowValue}>{item.ime}</Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Text style={styles.profileColumnRowLabel}>Last Name</Text>
                    <Text style={styles.profileColumnRowValue}>
                      {item.priimek}
                    </Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Text style={styles.profileColumnRowLabel}>Email</Text>
                    <Text style={styles.profileColumnRowValue}>
                      {item.email}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.key}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
        <View style={styles.buttonsProfileContainer}>
          <View style={styles.singleProfileButton}>
            <Button
              title="Edit Profile"
              color="#deb887"
              onPress={() => setProfileModalVisible(true)}
            />
          </View>
          <View style={styles.singleProfileButton}>
            <Button
              title="Change Password"
              color="#deb887"
              onPress={() => setPassModalVisible(true)}
            />
          </View>
        </View>
      </View>
      <View style={styles.logoutButton}>
        <Button title="Log Out" color="#ff6347" onPress={signOut} />
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              defaultValue={user}
              caretHidden={true}
            />
            <TextInput
              style={styles.input}
              onChangeText={setLastName}
              defaultValue={userData[0]?.priimek}
            />
            <TextInput
              style={styles.input}
              defaultValue={userData[0]?.email}
              onChangeText={setEmail}
              inputMode="email"
              keyboardType="email-address"
            />
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Edit" color="#deb887" onPress={editProfile} />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => setProfileModalVisible(false)}
                  color="#c0c0c0"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isPassModalVisible}
        onRequestClose={() => setPassModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text>Current Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <Text>New Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <Text>Confirm Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button
                  title="Change"
                  color="#deb887"
                  onPress={changePassword}
                />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => setPassModalVisible(false)}
                  color="#c0c0c0"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
