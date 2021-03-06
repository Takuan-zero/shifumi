import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Scene, Router, Stack } from 'react-native-router-flux';
import styled from 'styled-components/native';

import configureStore from './store';

import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import HomeLogged from './screens/HomeLogged';
import Lobby from './screens/Lobby';
import Game from './screens/Game';

const MainStack = styled(Stack)``;

const store = configureStore();
export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <MainStack key="root">
            <Scene key="Home" component={Home} title="Home" />
            <Scene key="Register" component={Register} title="Register" />
            <Scene key="Login" component={Login} title="Login" />
            <Scene key="Lobby" component={Lobby} title="Lobby" />
            <Scene key="Game" component={Game} title="Game" />
            <Scene key="HomeLogged" component={HomeLogged} title="Shifumi" />
          </MainStack>
        </Router>
      </Provider>
    );
  }
}
