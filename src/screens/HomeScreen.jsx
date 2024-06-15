import React, {useState, useEffect} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker';
import {AuthContext} from '../features/AuthContext';

import RecentWork from '../components/RecentWork';
import styles from '../styles';
import {formatDateTime, formatDate} from '../utils';

import {customFetch} from '../utils';

const HomeScreen = ({navigation}) => {
  const {userToken, user} = React.useContext(AuthContext);

  console.log(user);
  console.log(userToken);

  const [projectData, setProjectData] = useState();
  const [workplaceData, setWorkplaceData] = useState();

  useEffect(() => {
    const fetchProjects = async () => {
      customFetch
        .get('/project', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(response => {
          if (response.data) {
            const projectResponse = response.data.result;
            const filteredProjects = [
              ...new Set(
                projectResponse
                  .filter(item => item.status === 1)
                  .map(item => item.projekt),
              ),
            ];
            setProjectData(filteredProjects);
          } else {
            ToastAndroid.show('No projects found', ToastAndroid.SHORT);
            console.log('No projects found...');
          }
        })
        .catch(error => {
          console.log(error);
          ToastAndroid.show('No projects found', ToastAndroid.SHORT);
        });
    };

    const fetchWorkplaces = async () => {
      customFetch
        .get('/workplace', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(response => {
          if (response.data) {
            const workplaceResponse = response.data.result;
            const filteredWorkplaces = [
              ...new Set(
                workplaceResponse
                  .filter(item => item.status === 1)
                  .map(item => item.stroj),
              ),
            ];
            setWorkplaceData(filteredWorkplaces);
          } else {
            ToastAndroid.show('No workplaces found', ToastAndroid.SHORT);
            console.log('No workplaces found...');
          }
        })
        .catch(error => {
          console.log(error);
          ToastAndroid.show('No workplaces found', ToastAndroid.SHORT);
        });
    };
    fetchProjects();
    fetchWorkplaces();
  }, []);

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
    if (startTime !== (null || undefined) && endTime !== (null || undefined)) {
      const data = {
        ime: user,
        projekt: project,
        stroj: workplace,
        zacetni_cas: formatDateTime(startTime),
        koncni_cas: formatDateTime(endTime),
      };

      const t1 = new Date(data.zacetni_cas);
      const t2 = new Date(data.koncni_cas);
      const diff = t2.getTime() - t1.getTime();

      if (diff > 0 && diff < 86400000) {
        customFetch('/work', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          data: data,
        })
          .then(response => {
            if (response.data) {
              console.log(response.status);
              console.log('Work was successfully added!');
              ToastAndroid.show(
                'Work was successfully added!',
                ToastAndroid.SHORT,
              );
              setModalVisible(false);
            } else {
              ToastAndroid.show('Failed to add work', ToastAndroid.SHORT);
              console.log('Failed to add work...');
            }
          })
          .catch(error => {
            console.log(error);
            ToastAndroid.show('Failed to add work', ToastAndroid.SHORT);
          });

        console.log(data);
      } else {
        console.log('Invalid datetime!');
        ToastAndroid.show('Invalid datetime!', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Wrong input. Failed to add work.', ToastAndroid.SHORT);
      console.log('Wrong input. Failed to add work.');
    }
  };

  return (
    <>
      <View style={styles.startWorkButton}>
        <Button title="Add New Work" onPress={openModal} color="#deb887" />
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
              data={projectData}
              save="value"
              boxStyles={styles.selectList}
              placeholder="Select Project"
              search={false}
            />
            <SelectList
              setSelected={val => setWorkplace(val)}
              data={workplaceData}
              save="value"
              boxStyles={styles.selectList}
              placeholder="Select Workplace"
              search={false}
            />
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setStartTimeOpen(true)}>
                <Text>
                  {startTime ? formatDate(startTime) : 'Select Start Datetime'}
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
                buttonColor="#deb887"
                dividerColor="#deb887"
              />
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setEndTimeOpen(true)}>
                <Text>
                  {endTime ? formatDate(endTime) : 'Select End Datetime'}
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
                buttonColor="#deb887"
                dividerColor="#deb887"
              />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.singleButton}>
                <Button title="Add" onPress={addWork} color="#deb887" />
              </View>
              <View style={styles.singleButton}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#c0c0c0"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <RecentWork />
    </>
  );
};

export default HomeScreen;
