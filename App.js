import React, { Component } from 'react';
import { Scene, Router, Stack } from 'react-native-router-flux';
import styled from 'styled-components/native';

import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';

const MainStack = styled(Stack)``;
export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Router>
        <MainStack key="root">
          <Scene key="Home" component={Home} title="Home" />
          <Scene key="Register" component={Register} title="Register" />
          <Scene key="Login" component={Login} title="Login" />
        </MainStack>
      </Router>
    );
  }
}
