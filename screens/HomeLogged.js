import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, TouchableHighlight, Image, ImageBackground, Alert } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Actions } from 'react-native-router-flux';

import DefaultUser from '../assets/images/default-user.png';
import BackImage from '../assets/images/11927.jpg';

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
  font-size: 60;
`;

const PictureContainer = styled.View`
  margin-bottom: 10;
`;

const Picture = styled(Image)`
  width: 100;
  height: 100;
  border-radius: 50;
`;

const ButtonLobby = styled(TouchableHighlight)`
  height: 85;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
  width: 300;
  border-radius: 30;
  background-color: #48bf00;
`;
const TextButtonLobby = styled.Text`
  font-size: 30px;
  color: #ffffff;
`;

const MiddleContainer = styled.View`
  align-items: center;
  margin-top: 10;
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
  flex: 1;
  flex-direction: column;
  margin-top: 20;
`;

const ButtonLogout = styled(TouchableHighlight)`
  height: 45;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
  width: 250;
  border-radius: 30;
  background-color: #b30000;
`;

const TextButtonLogout = styled.Text`
  color: #ffffff;
`;

class HomeLogged extends Component {
  onClickListener = param => {
    const { jwt, username } = this.props;

    if (param === 'logout') {
      fetch('http://46.101.250.58:3000/auth/logout', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(response => {
          if (!response.ok) {
            /* eslint-disable-next-line no-underscore-dangle */
            throw new Error(response._bodyText);
          }
          return response.json();
        })
        .then(responseJson => {
          Actions.pop();
          Actions.replace('Home');
          Alert.alert(`You are logout`, JSON.stringify(responseJson));
        })
        .catch(error => {
          Alert.alert(`Get User logout request fail`, `Reason: ${error}`);
        });
    }

    if (param === 'lobby') {
      Actions.push('Lobby', { username, jwt });
    }
  };

  render() {
    const { username } = this.props;
    return (
      <Wrapper>
        <Background source={BackImage}>
          <TopContainer>
            <TopContainerTitle>Profile</TopContainerTitle>
          </TopContainer>
          <MiddleContainer>
            <PictureContainer>
              <Picture source={DefaultUser} />
            </PictureContainer>
            <InputContainer>
              <InputIcon
                source={{
                  uri: 'https://img.icons8.com/ultraviolet/40/000000/human-head.png',
                }}
              />
              <InputText
                placeholder={username}
                keyboardType="default"
                underlineColorAndroid="transparent"
                editable={false}
              />
            </InputContainer>
            <ButtonLogout onPress={() => this.onClickListener('logout')}>
              <TextButtonLogout>Logout</TextButtonLogout>
            </ButtonLogout>
            <BottomContainer>
              <ButtonLobby onPress={() => this.onClickListener('lobby')}>
                <TextButtonLobby>Lobby</TextButtonLobby>
              </ButtonLobby>
            </BottomContainer>
          </MiddleContainer>
        </Background>
      </Wrapper>
    );
  }
}

HomeLogged.propTypes = {
  username: PropTypes.string.isRequired,
  jwt: PropTypes.string.isRequired,
};

export default connect()(HomeLogged);
