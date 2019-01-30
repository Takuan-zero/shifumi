import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import { AppLoading, Font } from 'expo';
import fontRoboto from 'native-base/Fonts/Roboto.ttf';
import fontRobotoMedium from 'native-base/Fonts/Roboto_medium.ttf';

import Logo from '../assets/images/triangle.png';
import BackImage from '../assets/images/11927.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  middleContainer: {
    alignItems: 'center',
    marginTop: 85,
  },
  bottomContainer: {
    margin: 20,
  },
  image: {
    width: 220,
    height: 190,
    justifyContent: 'center',
  },
  h1: {
    color: '#fcf011',
    fontSize: 100,
  },
  h2: {
    textAlign: 'center',
    marginTop: 50,
    color: '#fcf011',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#fcf011',
    alignItems: 'center',
    width: '90%',
    height: 100,
    marginTop: 50,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#00b5ec',
  },
  loginText: {
    color: 'white',
  },
});

export default class SignInSignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      email: '',
      password: '',
    };
  }

  componentWillMount() {
    this.loadFonts();
  }

  onClickListener = viewId => {
    const { email, password } = this.state;
    Alert.alert('Alert', `Button pressed ${viewId} email: ${email} password: ${password}`);
  };

  async loadFonts() {
    await Font.loadAsync({
      Roboto: fontRoboto,
      Roboto_medium: fontRobotoMedium,
    });
    this.setState({ isReady: true });
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={BackImage} style={{ width: '100%', height: '100%' }}>
          <View style={styles.topContainer}>
            <Text style={styles.h1}>Shifumi</Text>
            <Image source={Logo} style={styles.image} />
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={email => this.setState({ email })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Password"
                secureTextEntry
                underlineColorAndroid="transparent"
                onChangeText={password => this.setState({ password })}
              />
            </View>
            <View style={styles.bottomContainer}>
              <TouchableHighlight
                style={[styles.buttonContainer, styles.loginButton]}
                onPress={() => this.onClickListener('login')}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.buttonContainer, styles.loginButton]}
                onPress={() => this.onClickListener('register')}
              >
                <Text style={styles.loginText}>Register</Text>
              </TouchableHighlight>
              <Text style={styles.h2}>Best game ever made</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
