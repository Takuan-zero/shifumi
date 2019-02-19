import React, { Component } from 'react';
import { TextInput, TouchableHighlight, Image, Alert, ImageBackground } from 'react-native';
import { AppLoading, Font } from 'expo';
import styled from 'styled-components/native';
import { Actions } from 'react-native-router-flux';

import fontRoboto from 'native-base/Fonts/Roboto.ttf';
import fontRobotoMedium from 'native-base/Fonts/Roboto_medium.ttf';

import BackImage from '../../assets/images/11927.jpg';

const Background = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TopContainer = styled.View`
  align-items: center;
  margin-top: 30;
`;

const TopContainerTitle = styled.Text`
  color: #fcf011;
  font-size: 100;
`;

const MiddleContainer = styled.View`
  align-items: center;
  margin-top: 85;
`;

const InputContainer = styled.View`
  border-bottom-color: #f5fcff;
  background-color: #ffffff;
  border-radius: 30;
  border-bottom-width: 1;
  width: 250;
  height: 45;
  margin-bottom: 20;
  flex-direction: row;
  align-items: center;
`;

const InputIcon = styled(Image)`
  width: 30;
  height: 30;
  margin-left: 15;
  justify-content: center;
`;

const InputText = styled(TextInput)`
  height: 45;
  margin-left: 16;
  border-bottom-color: #ffffff;
  flex: 1;
`;

const BottomContainer = styled.View`
  margin-top: 20;
`;

const ButtonRegister = styled(TouchableHighlight)`
  height: 45;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
  width: 250;
  border-radius: 30;
  background-color: #00b5ec;
`;

const TextButton = styled.Text`
  color: #ffffff;
`;

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      username: '',
      email: '',
      password: '',
    };
  }

  componentWillMount() {
    this.loadFonts();
  }

  onClickListener = viewId => {
    const { email, password, username } = this.state;
    Actions.push('Home');
    Alert.alert(
      'You are register. Please login with your credentials',
      `Button pressed ${viewId} email: ${email} password: ${password} username: ${username}`
    );
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
      <Wrapper>
        <Background source={BackImage}>
          <TopContainer>
            <TopContainerTitle>Register</TopContainerTitle>
          </TopContainer>
          <MiddleContainer>
            <InputContainer>
              <InputIcon
                source={{
                  uri: 'https://img.icons8.com/ultraviolet/40/000000/human-head.png',
                }}
              />
              <InputText
                placeholder="Username"
                keyboardType="default"
                underlineColorAndroid="transparent"
                onChangeText={username => this.setState({ username })}
              />
            </InputContainer>
            <InputContainer>
              <InputIcon
                source={{
                  uri: 'https://png.icons8.com/message/ultraviolet/50/3498db',
                }}
              />
              <InputText
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={email => this.setState({ email })}
              />
            </InputContainer>
            <InputContainer>
              <InputIcon
                source={{
                  uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db',
                }}
              />
              <InputText
                placeholder="Password"
                secureTextEntry
                underlineColorAndroid="transparent"
                onChangeText={password => this.setState({ password })}
              />
            </InputContainer>
            <BottomContainer>
              <ButtonRegister onPress={() => this.onClickListener('register')}>
                <TextButton>Register</TextButton>
              </ButtonRegister>
            </BottomContainer>
          </MiddleContainer>
        </Background>
      </Wrapper>
    );
  }
}
