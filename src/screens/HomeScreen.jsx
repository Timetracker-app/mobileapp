import React, {useState} from 'react';
import {Button, View, Text, TouchableOpacity, Modal} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';

import RecentWork from '../components/RecentWork';
import styles from '../styles';

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [project, setProject] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const openModal = item => {
    setProject(item.project);
    setWorkplace(item.workplace);
    setStartTime(item.starttime);
    setEndTime(item.endtime);
    setModalVisible(true);
  };

  const addWork = () => {
    // Save changes logic here (e.g., update the item in the state or send it to a server)
    setModalVisible(false);
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
      <View style={styles.startWorkButton}>
        <Button title="Start New Work" onPress={openModal} color="#deb887" />
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
                    ? startTime.toLocaleString('en-GB')
                    : 'Select Start Time'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={startTimeOpen}
                date={startTime || new Date()}
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
                    ? endTime.toLocaleString('en-GB')
                    : 'Select End Time'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={endTimeOpen}
                date={endTime || new Date()}
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
              <Button title="Add" onPress={addWork} color="#deb887" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <RecentWork />
    </>
  );
};

export default HomeScreen;
