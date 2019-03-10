import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, Image, ImageBackground, Alert, View } from 'react-native';
import { ImagePicker, Camera, Permissions } from 'expo';
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

const CameraContainer = styled.View`
  width: 100;
  height: 100;
  border-radius: 50;
  margin-bottom: 10;
`;

const Picture = styled(Image)`
  width: 100;
  height: 100;
  border-radius: 50;
`;

const ButtonLobby = styled(TouchableHighlight)`
  height: 45;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
  width: 300;
  border-radius: 30;
  background-color: #48bf00;
`;
const TextButtonLobby = styled.Text`
  color: #ffffff;
`;

const MiddleContainer = styled.View`
  align-items: center;
  margin-top: 10;
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

const ButtonPicture = styled(TouchableHighlight)`
  height: 45;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20;
  width: 250;
  border-radius: 30;
  background-color: #00b5ec;
`;

const TextButtonPicture = styled.Text`
  color: #ffffff;
`;

class HomeLogged extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    image: null,
    hiddenCamera: true,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  onClickListener = param => {
    const { jwt, username, email, id } = this.props;

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
      Actions.push('Lobby', { username, jwt, email, id });
    }
  };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  snap = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      this.setState({ image: photo.uri });
      this.setState({ hiddenCamera: true });
    }
  };

  render() {
    const { username } = this.props;
    const { image, hasCameraPermission, type, hiddenCamera } = this.state;

    return (
      <Wrapper>
        <Background source={BackImage}>
          <TopContainer>
            <TopContainerTitle>{username}</TopContainerTitle>
          </TopContainer>
          <MiddleContainer>
            <PictureContainer>
              <Picture source={image === null ? DefaultUser : { uri: image }} />
            </PictureContainer>
            <ButtonPicture onPress={this.pickImage}>
              <TextButtonPicture>Galery</TextButtonPicture>
            </ButtonPicture>
            <ButtonPicture
              onPress={() => {
                if (hiddenCamera === true) this.setState({ hiddenCamera: false });
                else {
                  this.snap();
                }
              }}
            >
              <TextButtonPicture>Camera</TextButtonPicture>
            </ButtonPicture>
            {hasCameraPermission === null ||
            hasCameraPermission === null ||
            hiddenCamera === true ? (
              <View />
            ) : (
              <CameraContainer hide={hiddenCamera}>
                <View style={{ flex: 1 }}>
                  <Camera
                    ref={ref => {
                      this.camera = ref;
                    }}
                    style={{ flex: 1 }}
                    type={type}
                  />
                </View>
              </CameraContainer>
            )}
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
  email: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default connect()(HomeLogged);
