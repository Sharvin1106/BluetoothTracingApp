import React, {useState, useEffect, useCallback} from 'react';
import {
  Alert,
  Text,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {deviceHeight} from '../helpers/constants';
import BottomContainer from '../components/dashboard';
import ImageContainer from '../components/topContainer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Button, Card, Title, Paragraph} from 'react-native-paper';
import axios from 'axios';
import {checkOutLocation} from '../redux/checkIn';
import {getLocationDetails} from './Scan';
import {getCentrality, getUser} from '../api';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import {authenticateUser} from '../redux/auth';
import {getData} from '../utils/storage';
import {useIsFocused} from '@react-navigation/core';

const Home = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [user, setUser] = useState({});
  const [hotspotLocation, setHotspotLocation] = useState(0);
  const [closeContacts, setCloseContacts] = useState(0);
  const [centrality, setCentrality] = useState(0);
  const {locations} = useSelector(state => state.checkIn);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getCurrentUser = useCallback(async () => {
    try {
      const userDetails = await getUser(auth().currentUser.uid);
      setUser(userDetails[0]);
      statusCheck(userDetails[0]);
      dispatch(authenticateUser(userDetails[0]));
    } catch (error) {
      console.log(error);
    }
  });
  const statusCheck = userDetail => {
    // console.log(userDetail);
    if (userDetail?.status === 'Suspected') {
      Alert.alert(
        'Exposure Notification',
        'You have been classified as casual contact, please upload your contact details',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('ok');
            },
          },
        ],
      );
    }
  };

  const fetchCentrality = async () => {
    try {
      if (closeContacts !== 0) {
        const userUuid = await getData('my_bluetooth_uuid');
        const myContacts = await getData('close_contact');
        const userCentrality = await getCentrality({
          uuid: userUuid,
          closeContact: myContacts,
        });
        setCentrality(userCentrality);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCentralityRange = (C, H) => {
    var X = parseInt(
      Math.log(1 / C) / Math.log(2.3) +
        (Math.log(H + 1) / Math.log(1.6)) * 10,
    );
    if (X > 50) return 'more';
    else return 'less';
  };
  useEffect(() => {
    //if (isFocused) {
    (async () => {
      try {
        // if (isFocused) {
        const locationNumber = await getData('hotspot_visited');
        console.log(locationNumber);
        console.log(locationNumber.length);
        setHotspotLocation(JSON.parse(locationNumber).length);
        // }
      } catch (error) {
        console.log(error);
      }
    })();

    (async () => {
      try {
        // if (isFocused) {
        const contactsNumber = await getData('close_contact');
        console.log(contactsNumber);
        setCloseContacts(JSON.parse(contactsNumber).length);
        fetchCentrality();
        // }
      } catch (error) {
        console.log(error);
      }
    })();

    getCurrentUser();
    //  }
  }, [navigation, isFocused]);

  return (
    <View style={[styles.container]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView>
        <View
          style={{
            height: Platform.OS === 'android' ? getStatusBarHeight() : 0,
          }}></View>
        <ImageContainer
          user={user}
          closeContacts={closeContacts}
          scrollY={scrollY}
        />
        <BottomContainer scrollY={scrollY} imageHeight={450}>
          <View style={styles.column}>
            {!locations.length ? (
              <Card style={styles.checkOut}>
                <Card.Content>
                  <Title style={styles.paragraph}>
                    You're currently not check in to anywhere.
                  </Title>
                  <Paragraph style={styles.paragraph3}>
                    🔰 Go to Check-In tab to Check-In a location.
                  </Paragraph>
                  <Paragraph style={styles.paragraph3}>
                    🔰 Stay Safe & Mask Up!
                  </Paragraph>
                </Card.Content>
              </Card>
            ) : (
              <View></View>
            )}

            {locations.map((location, i) => {
              console.log(location.loc);
              console.log('Size=' + i);
              return (
                <Card style={styles.checkOut}>
                  <Card.Content>
                    <Title style={styles.paragraph}>
                      Checked in at {location.loc}
                    </Title>
                    <Paragraph style={styles.paragraph2}>
                      Date: {location.date}
                    </Paragraph>
                    <Paragraph style={styles.paragraph2}>
                      Time: {location.time}
                    </Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      onPress={() => {
                        dispatch(checkOutLocation(location.id));
                        getLocationDetails;
                        axios.post(
                          'https://jom-trace-backend.herokuapp.com/checkOut',
                          {
                            location: location.id,
                          },
                          {
                            headers: {
                              'Content-Type': 'application/json',
                              //other header fields
                            },
                          },
                        );
                      }}
                      style={styles.button}>
                      Check-Out
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })}
          </View>

          <View style={styles.row}>
            <View style={styles.Tracker}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Hotspot Tracker</Title>
                  <Text style={styles.stats}>{hotspotLocation}</Text>
                  <Paragraph style={styles.paragraph}>
                    hotspot location have been visited in the last 14 days.
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>

            <View style={{flex: 0.1}} />

            <View style={styles.riskEst}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Risk Estimation</Title>
                  <Text style={styles.stats}>
                    {/* {centrality ? 1 / centrality : 0}% */}
                    {centrality
                      ? parseInt(
                          ((Math.log((1/centrality)+1) / Math.log(1.7)) +
                            (Math.log(hotspotLocation+1) / Math.log(1.3)) * 10))
                      : 0}
                    %
                  </Text>
                  <Paragraph style={styles.paragraph}>
                    You’re {getCentralityRange(centrality,hotspotLocation)} likely exposed to
                    Covid-19. Stay safe!
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
          </View>
        </BottomContainer>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D5FFE3',
    display: 'flex',
    flex: 1,
    height: deviceHeight,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkOut: {
    width: '100%',
    paddingHorizontal: '1%',
    alignItems: 'flex-start',
    borderRadius: 40,
    shadowColor: '#3E4248',
    elevation: 20,
  },

  Tracker: {
    width: '50%',
    height: 220,
    alignItems: 'center',
    borderRadius: 40,
    flex: 2,
    shadowColor: '#3E4248',
    elevation: 20,
  },

  riskEst: {
    width: '50%',
    height: 220,
    alignItems: 'center',
    borderRadius: 40,
    flex: 2,
    shadowColor: '#3E4248',
    elevation: 20,
  },

  seveReport: {
    height: 220,
    marginHorizontal: '1%',
    alignItems: 'flex-start',
    borderRadius: 40,
    flex: 2,
    shadowColor: '#3E4248',
    elevation: 20,
  },

  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginHorizontal: '3%',
    marginBottom: '5%',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: '5%',
  },

  stats: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 64,
    textAlign: 'center',
    color: '#FF6B6B',
  },

  paragraph: {
    textAlign: 'left',
  },

  paragraph2: {
    marginTop: '1%',
    paddingTop: '5%',
    fontSize: 20,
    fontFamily: 'SF Pro Text',
    fontWeight: 'bold',
    //color: '#0D4930',
  },

  paragraph3: {
    fontSize: 16,
    //color: '#0D4930',
    marginVertical: '3%',
  },

  button: {
    backgroundColor: '#76E6BE',
    borderRadius: 25,
    padding: '5%',
    paddingVertical: '2%',
  },
});

export default Home;
