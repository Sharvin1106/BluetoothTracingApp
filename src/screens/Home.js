import React, {useState} from 'react';
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

const Home = props => {
  const data = {
    labels: ['Apple', 'Banana', 'Cherry'], // optional
    data: [0.2, 0.5, 0.8],
  };

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
  var size = locations.length;
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
        <ImageContainer scrollY={scrollY} />
        <BottomContainer scrollY={scrollY} imageHeight={450}>
          <View style={styles.column}>
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
