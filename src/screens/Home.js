import React, {useState} from 'react';
import {
<<<<<<< HEAD
  Alert,
=======
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
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
<<<<<<< HEAD
import {deviceWidth} from '../helpers/constants';
import BottomContainer from '../components/dashboard';
import ImageContainer from '../components/topContainer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {ProgressChart} from 'react-native-chart-kit';
import axios from 'axios';

const Home = props => {
  const data = {
    labels: ['Apple', 'Banana', 'Cherry'], // optional
    data: [0.2, 0.5, 0.8],
  };

=======
import BottomContainer from '../components/dashboard';
import ImageContainer from '../components/topContainer';
import {LoadingAtom} from '../components/loadingAtom';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {color} from 'react-native-reanimated';

const Home = props => {
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  //This part of the code will retrieve all items from the checkIn store
  //Check in store is in redux/store/checkIn
  //You will need to use useSelector hook to get checkIn details
  // state.checkIn - specifying which redux reducer yr referring to
  // useDispatch will be used to execute function inside redux
  //You can't simply call them as usual functions, it will not update the store nor screen
  // So you need a useDispatch hook to execute them
  const {locations} = useSelector(state => state.checkIn);
  const dispatch = useDispatch();
<<<<<<< HEAD
  var size = locations.length;
  console.log(size);
=======
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
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
        <ImageContainer scrollY={scrollY} />
        <BottomContainer scrollY={scrollY} imageHeight={450}>
          <View style={styles.column}>
<<<<<<< HEAD
            {locations.map((location, i) => {
              console.log(location.checkInObj.loc);
              if (i == size - 1)
                return (
                  <Card style={styles.checkOut}>
                    <Card.Content>
                      <Title style={styles.paragraph}>
                        Checked in at {location.checkInObj.loc}
                      </Title>
                      <Paragraph style={styles.paragraph2}>
                        Date: {location.checkInObj.date}
                      </Paragraph>
                      <Paragraph style={styles.paragraph2}>
                        Time: {location.checkInObj.time}
                      </Paragraph>
                    </Card.Content>
                    <Card.Actions>
                      <Button
                        onPress={() =>
                          axios.post(
                            'https://jom-trace-backend.herokuapp.com/checkOut',
                            {
                              location: location.checkInObj.id,
                            },
                            {
                              headers: {
                                'Content-Type': 'application/json',
                                //other header fields
                              },
                            },
                          )
                        }
                        style={styles.button}>
                        Check-Out
                      </Button>
                    </Card.Actions>
                  </Card>
                );
=======
            {locations.map(location => {
              return (
                <Card style={styles.checkOut}>
                  <Card.Content>
                    <Title>Checked in at {location.locationName}</Title>
                    <Paragraph>Date: </Paragraph>
                    <Paragraph>Time: </Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button style={styles.button}>Check-Out</Button>
                  </Card.Actions>
                </Card>
              );
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
            })}
          </View>

          <View style={styles.row}>
            <View style={styles.Tracker}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Hotspot Tracker</Title>
                  <Text style={styles.stats}>88</Text>
                  <Paragraph style={styles.paragraph}>
                    hotspot location have been visited in the last 14 days.
                  </Paragraph>
<<<<<<< HEAD
                </Card.Content>
              </Card>
            </View>

            <View style={{flex: 0.1}} />

            <View style={styles.riskEst}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Risk Estimation</Title>
                  <Text style={styles.stats}>83%</Text>
                  <Paragraph style={styles.paragraph}>
                    You’re less likely exposed to Covid-19. Stay safe!
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
=======
                </Card.Content>
              </Card>
            </View>

            <View style={{flex: 0.1}} />

            <View style={styles.riskEst}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Risk Estimation</Title>
                  <Text style={styles.stats}>83%</Text>
                  <Paragraph style={styles.paragraph}>
                    You’re less likely exposed to Covid-19. Stay safe!
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
          </View>

          <View style={styles.row}>
            <View style={styles.seveReport}>
              <Card style={{borderRadius: 40}}>
                <Card.Content>
                  <Title>Severity Report</Title>
                </Card.Content>
<<<<<<< HEAD
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
=======
                <Card.Actions>
                  <Button>Check-Out</Button>
                </Card.Actions>
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
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
<<<<<<< HEAD
    shadowColor: '#3E4248',
    elevation: 20,
=======
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
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

<<<<<<< HEAD
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
=======
  button: {
    backgroundColor: '#76E6BE',
    color: '#0D4930',
    alignItems: 'center',
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
  },
});

export default Home;
