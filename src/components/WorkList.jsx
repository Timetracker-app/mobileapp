import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  Modal,
  Button,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';

import styles from '../styles';
import {formatDate} from '../utils';

import useToken from '../features/useToken';
import {customFetch} from '../utils';
const url = '/work';

const WorkList = () => {
  const {token, user, loading} = useToken();

  console.log(user);
  console.log(token);

  const [data, setData] = useState();

  useEffect(() => {
    customFetch
      .get(url, {
        params: {
          worker: user,
          project: '',
          workplace: '',
          starttime: '',
          endtime: '',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.data) {
          setData(response.data.result);
        } else {
          ToastAndroid.show('No work found', ToastAndroid.SHORT);
          console.log('No work found...');
        }
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('No work found', ToastAndroid.SHORT);
      });
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [project, setProject] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const openModal = item => {
    setProject(item.projekt);
    setWorkplace(item.stroj);
    setStartTime(new Date(item.zacetni_cas));
    setEndTime(new Date(item.koncni_cas));
    setModalVisible(true);
  };

  const editWork = () => {
    // Save changes logic here (e.g., update the item in the state or send it to a server)
    setModalVisible(false);
  };

  const deleteWork = () => {
    // Save changes logic here (e.g., update the item in the state or send it to a server)
    setModalVisible(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={styles.columnHeaderTxt}>Project</Text>
        <Text style={styles.columnHeaderTxt}>Workplace</Text>
        <Text style={styles.columnHeaderTxt}>Start Time</Text>
        <Text style={styles.columnHeaderTxt}>End Time</Text>
      </View>
    );
  };

  const projects = [
    {key: '1', value: 'Intarzija', disabled: true},
    {key: '2', value: 'Kant'},
    {key: '3', value: 'Vezi'},
    {key: '4', value: 'Miza', disabled: true},
  ];
  const workplaces = [
    {key: '1', value: 'Brusilka', disabled: true},
    {key: '2', value: 'Cepilka'},
    {key: '3', value: 'Sekular'},
    {key: '4', value: 'Formatna žaga', disabled: true},
  ];

  return (
    <>
      <View style={styles.workContainer}>
        <View style={styles.rowContainer}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={styles.rowContainer}>
                  <Text style={styles.columnRowTxt}>{item.projekt}</Text>
                  <Text style={styles.columnRowTxt}>{item.stroj}</Text>
                  <Text style={styles.columnRowTxt}>
                    {formatDate(item.zacetni_cas)}
                  </Text>
                  <Text style={styles.columnRowTxt}>
                    {formatDate(item.koncni_cas)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader}
            keyExtractor={item => item.key}
          />
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Work</Text>
            <SelectList
              setSelected={val => setProject(val)}
              data={projects}
              save="value"
              boxStyles={styles.selectList}
            />
            <SelectList
              setSelected={val => setWorkplace(val)}
              data={workplaces}
              save="value"
              boxStyles={styles.selectList}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setStartTimeOpen(true)}>
                <Text>
                  {startTime
                    ? `${startTime.toDateString()} ${
                        startTime
                          .toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          .split(' ')[0]
                      }`
                    : 'Select Start DateTime'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={startTimeOpen}
                date={startTime}
                onConfirm={date => {
                  setStartTimeOpen(false);
                  setStartTime(date);
                }}
                onCancel={() => {
                  setStartTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setEndTimeOpen(true)}>
                <Text>
                  {endTime
                    ? `${endTime.toDateString()} ${
                        endTime
                          .toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          .split(' ')[0]
                      }`
                    : 'Select End DateTime'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={endTimeOpen}
                date={endTime}
                onConfirm={date => {
                  setEndTimeOpen(false);
                  setEndTime(date);
                }}
                onCancel={() => {
                  setEndTimeOpen(false);
                }}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Button title="Edit" onPress={editWork} color="#deb887" />
              <Button title="Delete" onPress={deleteWork} color="#ff6347" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WorkList;
