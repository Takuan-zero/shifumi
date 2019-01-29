import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import Logo from '../assets/images/shifumi.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ced8e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    color: '#008F68',
    fontSize: 70,
  },
  h2: {
    color: '#008F68',
    fontSize: 18,
    marginTop: 8,
  },
  buttonContainer: {
    backgroundColor: '#008F68',
    borderRadius: 5,
    margin: 8,
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    width: '90%',
    margin: 20,
    padding: 10,
  },
});

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Shifumi Online</Text>
          <Text style={styles.h2}>Best game ever made</Text>
        </View>
        <View style={styles.middleContainer}>
          <Image source={Logo} style={styles.image} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="LET'S START"
              style={styles.button}
              onPress={() => this.onPress()}
              color="#008F68"
            />
          </View>
        </View>
      </View>
    );
  }
}
