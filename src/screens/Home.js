import React, {useState, useEffect} from 'react';
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
import {deviceWidth} from '../helpers/constants';
import BottomContainer from '../components/dashboard';
import ImageContainer from '../components/topContainer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {ProgressChart} from 'react-native-chart-kit';
import axios from 'axios';
import {checkOutLocation} from '../redux/checkIn';
import {getLocationDetails} from './Scan';
import {getUser} from '../api';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';

const Home = props => {
  const data = {
    labels: ['Oxygen', 'Temperature', 'Others'], // optional
    data: [0.2, 0.5, 0.8],
  };
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [user, setUser] = useState({});
  const {locations} = useSelector(state => state.checkIn);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  var size = locations.length;

  const getCurrentUser = async () => {
    try {
      const userDetails = await getUser(auth().currentUser.uid);
      setUser(userDetails[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [navigation]);

  const username = getUser.username;

  console.log(size);
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
        <ImageContainer user={user} scrollY={scrollY} />
        <BottomContainer scrollY={scrollY} imageHeight={450}>
          <View style={styles.column}>
            {locations.map((location, i) => {
              console.log(location.loc);
              if (i == size - 1)
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
                  <Text style={styles.stats}>0</Text>
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
                  <Text style={styles.stats}>15%</Text>
                  <Paragraph style={styles.paragraph}>
                    You’re less likely exposed to Covid-19. Stay safe!
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.seveReport}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Severity Report</Title>
                </Card.Content>
                <ProgressChart
                  data={data}
                  width={deviceWidth - 30}
                  height={220}
                  chartConfig={{
                    //backgroundColor: '#fff',
                    backgroundGradientFrom: '#FFF',
                    backgroundGradientTo: '#FFF5',
                    //decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                  }}
                  style={{
                    borderRadius: 40,
                  }}
                />
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
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
    height: deviceHeight,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkOut: {
    width: '100%',
    paddingHorizontal: '5%',
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
    textAlign: 'center',
  },

  paragraph2: {
    marginTop: '1%',
    paddingTop: '5%',
    fontSize: 20,
    fontFamily: 'SF Pro Text',
    fontWeight: 'bold',
    color: '#0D4930',
  },

  button: {
    backgroundColor: '#76E6BE',
    borderRadius: 25,
    padding: '5%',
    paddingVertical: '2%',
  },
});

export default Home;
