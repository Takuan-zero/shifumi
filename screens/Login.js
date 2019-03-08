import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, TouchableHighlight, Image, Alert, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

import login from '../actions/login';

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

class Login extends Component {
  state = {
    username: '',
    password: '',
    jwt: null,
  };

  onClickListener = () => {
    const { loginDispatch } = this.props;
    const { username, password } = this.state;
    // TODO: Add front user data validation
    fetch('http://46.101.250.58:3000/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          /* eslint-disable-next-line no-underscore-dangle */
          throw new Error(response._bodyText);
        }
        this.setState({
          jwt: response.headers.map.authorization,
        });
        return response.json();
      })
      .then(responseJson => {
        loginDispatch(this.state);
        // Actions.pop();
        // Actions.push('Lobby');
        Actions.Lobby({ token: this.state.jwt });
        Alert.alert(`Welcome`, JSON.stringify(responseJson));
      })
      .catch(error => {
        Alert.alert(`POST User login request fail`, `Reason: ${error}`);
      });
  };

  render() {
    return (
      <Wrapper>
        <Background source={BackImage}>
          <TopContainer>
            <TopContainerTitle>Login</TopContainerTitle>
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
              <ButtonRegister onPress={() => this.onClickListener()}>
                <TextButton>Connection</TextButton>
              </ButtonRegister>
            </BottomContainer>
          </MiddleContainer>
        </Background>
      </Wrapper>
    );
  }
}

Login.propTypes = {
  loginDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginDispatch: user => {
      dispatch(login(user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
