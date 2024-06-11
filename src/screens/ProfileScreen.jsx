import React from 'react';
import {Text, View, Button, FlatList} from 'react-native';

import styles from '../styles';

const ProfileScreen = ({navigation, route}) => {
  return (
    <>
      <View style={styles.profileContainer}>
        <View style={styles.rowContainer}>
          <FlatList
            data={[
              {
                key: '1',
                name: 'Test',
                lastName: 'Test',
                email: 'test@gmail.com',
              },
            ]}
            renderItem={({item}) => {
              return (
                <View>
                  <Text style={styles.columnRowTxt}>{item.name}</Text>
                  <Text style={styles.columnRowTxt}>{item.lastName}</Text>
                  <Text style={styles.columnRowTxt}>{item.email}</Text>
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
        <Button title="Sign Out" color="#ff6347" />
      </View>
    </>
  );
};

export default ProfileScreen;
