import React from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, Image, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styled from 'styled-components/native';

import Logo from '../assets/images/triangle.png';
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

const TopImage = styled(Image)`
  width: 220;
  height: 190;
  justify-content: center;
`;

const TopContainerTitle = styled.Text`
  color: #fcf011;
  font-size: 100;
`;

const MiddleContainer = styled.View`
  align-items: center;
  margin-top: 85;
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

const BottomText = styled.Text`
  text-align: center;
  margin-top: 50;
  color: #fcf011;
  font-size: 18;
`;

const Home = () => {
  return (
    <Wrapper>
      <Background source={BackImage}>
        <TopContainer>
          <TopContainerTitle>Shifumi</TopContainerTitle>
          <TopImage source={Logo} />
        </TopContainer>
        <MiddleContainer>
          <ButtonRegister onPress={() => Actions.push('Login')}>
            <TextButton>Login</TextButton>
          </ButtonRegister>
          <ButtonRegister onPress={() => Actions.push('Register')}>
            <TextButton>Register</TextButton>
          </ButtonRegister>
        </MiddleContainer>
        <BottomContainer>
          <BottomText>Best game ever made</BottomText>
        </BottomContainer>
      </Background>
    </Wrapper>
  );
};

export default connect()(Home);
