import React, { useState } from 'react';
import { Alert, Text, Animated, SafeAreaView, StatusBar, StyleSheet, View, Platform } from 'react-native';
import { deviceHeight } from '../helpers/constants';
import { deviceWidth } from '../helpers/constants';
import BottomContainer from '../components/dashboard';
import ImageContainer from '../components/topContainer';
// import { LoadingAtom } from '../components/loadingAtom';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
// import { color } from 'react-native-reanimated';
import { ProgressChart } from "react-native-chart-kit";
import { DonutChart } from "react-native-circular-chart";

const Home = (props) => {

  const data = {
    labels: ["Apple", "Banana", "Cherry"], // optional
    data: [0.2, 0.5, 0.8]
  };

  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle='light-content' backgroundColor='transparent' translucent={true} />
      <SafeAreaView>
        <View style={{ height: Platform.OS === 'android' ? getStatusBarHeight() : 0 }}>
        </View>
        <ImageContainer
          scrollY={scrollY}
        />
        <BottomContainer
          scrollY={scrollY}
          imageHeight={450}
        >
          <View style={styles.column}>
            <Card style={styles.checkOut}>
                <Card.Content>
                  <Title>Last checked in at BHEPA</Title>
                  <Paragraph>Date: </Paragraph>
                  <Paragraph>Time: </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => Alert.alert('Simple Button pressed')} style={styles.button}>Check-Out</Button>
                </Card.Actions>
              </Card>
          </View>
              
              <View style={styles.row}>
                <View style={styles.Tracker}>
                <Card style={{borderRadius: 40,}}>
                  <Card.Content >
                    <Title>Hotspot Tracker</Title>
                    <Text style={styles.stats}>88</Text>
                    <Paragraph style={styles.paragraph}>hotspot location have been visited in the last 14 days.</Paragraph>
                  </Card.Content>
                </Card>
                </View>
                
                <View style={{flex:0.1}}/>

                <View style={styles.riskEst}>
                <Card style={{borderRadius: 40,}}>
                  <Card.Content>
                    <Title>Risk Estimation</Title>
                    <Text style={styles.stats}>83%</Text>
                    <Paragraph style={styles.paragraph}>You’re less likely exposed to Covid-19. Stay safe!</Paragraph>
                  </Card.Content>
                </Card>
                </View>
                </View>
            
            <View style={styles.row}>
            <View style={styles.seveReport}>
            <Card style={{borderRadius: 40,}}>
                  <Card.Content>
                    <Title>Severity Report</Title>
                  </Card.Content>
                  <ProgressChart
                    data={data}
                    width={ deviceWidth - 30 }
                    height={220}
                    chartConfig={{
                      //backgroundColor: '#fff',
                      backgroundGradientFrom: '#FFF',
                      backgroundGradientTo: '#FFF5',
                      //decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    }}
                    style= {{
                      borderRadius: 40,
                    }}
                  />
                </Card>
                </View> 
              </View>
        </BottomContainer>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
    height: deviceHeight,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },

  checkOut: {
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'flex-start',
    borderRadius: 40,

  },

  Tracker: {
    width: '50%',
    height: 220,
    alignItems: 'center',
    borderRadius: 40,
    flex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,

    elevation: 5,
  },

  riskEst: {
    width: '50%',
    height: 220,
    alignItems: 'center',
    borderRadius: 40,
    flex: 2,
  },

  seveReport: {
    height: 220,
    marginHorizontal: '1%',
    alignItems: 'flex-start',
    borderRadius: 40,
    flex: 2,
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
    padding:10,
    marginBottom: '5%',
    
    
},

stats: {
  fontFamily: 'Inter',
  fontWeight: 'bold',
  fontSize: 64,
  textAlign: 'center',
  color: '#FF6B6B'
},

paragraph: {
  textAlign: 'center',
},

button: {
  backgroundColor: '#76E6BE',
  color: '#0D4930',
  alignItems: 'center',
  
},

})

export default Home;