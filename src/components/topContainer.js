import React from 'react';
import {Text, Animated, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getUser} from '../api';

const ImageContainer = ({scrollY, imageSource, imageHeight, user}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0.5}}
      end={{x: 1, y: 1}}
      colors={['#67D7CE', '#83F3AD']}
      style={styles.linearGradient}>
      <Text style={styles.titleText}>JomTrace</Text>
      <Text style={styles.Text}>
        Hey {user.username}, mask up! {'\n'}You’ve been in contact with {} people
        today.
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: 450,
    backgroundColor: '#f6f6f6',
  },

  titleText: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 32,
    marginLeft: '5%',
    marginTop: '10%',
    color: 'white',
  },

  Text: {
    fontFamily: 'Sf Pro Display',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: '5%',
    marginTop: '3%',
    color: '#0D4930',
    paddingRight: '12%',
    lineHeight: 33,
  },
});

export default ImageContainer;
