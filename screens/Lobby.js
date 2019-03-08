import { Actions } from 'react-native-router-flux';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Dimensions,
  RefreshControl,
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';
import { Button } from 'react-native-elements';
import { Circle } from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import propTypes from 'prop-types';
import Dialog from 'react-native-dialog';
// import { NavigationEvents } from 'react-navigation';
/* import {
  getRoomFetch
} from '../api/request'; */
/* import {
  joinRoomDispatch
} from '../redux/actions/actions'; */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
});

class Lobby extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const { token } = this.props;
    console.log(token);
    const tokenCode = token.split(' ')[1];
    const socketTmp = io('http://46.101.250.58:4242');
    socketTmp.on('error', () => {});
    socketTmp.on('connect_failed', () => {});
    socketTmp.on('ready', () => {
      console.log('Ready');
    });
    this.state = {
      socket: socketTmp,
      datas: undefined,
      refreshing: false,
      nameRoom: '',
      gotFocus: false,
    };
  }

  componentDidMount() {
    const { token } = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    console.log('lobby token', token);
    // this.redirectLoginScreen(this.props);
    if (token !== '') {
      fetch('http://46.101.250.58:3000/rooms', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.status);
        })
        .then(json => {
          this.setState({
            datas: json,
          });
        })
        .catch(() => {});
    }
  }

  componentDidUpdate() {
    const { gotFocus } = this.state;
    // this.redirectLoginScreen(this.props);
    if (gotFocus) {
      this.handleRefresh();
    }
  }

  redirectLoginScreen = props => {
    const { navigation, logout } = props;
    const { navigate } = navigation;
    const { token, isConnect } = props;
    const { socket } = this.state;
    if (token === '' || token === undefined) {
      // navigate('Login');
    }
    if (isConnect === false) {
      if (token !== '' && token !== undefined) logout(token);
      socket.disconnect();
      // navigate('Login');
    }
  };

  addRoom = () => {
    const { joinRoom, navigation } = this.props;
    const { navigate } = navigation;
    const { socket, nameRoom } = this.state;
    this.setState({
      nameRoomError: false,
    });
    if (nameRoom !== '') {
      socket.emit(
        'createRoom',
        {
          name: nameRoom,
        },
        data => {
          const { id } = data.room;
          if (data.success) {
            joinRoom(id);
            this.setState({
              displayDialog: false,
              nameRoom: '',
            });
            this.componentDidMount();
            navigate('Game', {
              socket,
            });
          }
        }
      );
    } else
      this.setState({
        nameRoomError: true,
      });
  };

  handleRefresh = () => {
    const { token } = this.props;
    const { gotFocus } = this.state;
    this.setState({
      refreshing: true,
    });
    if (gotFocus)
      this.setState({
        gotFocus: false,
      });
    if (token !== '') {
      fetch('http://46.101.250.58:3000/rooms', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.status);
        })
        .then(json => {
          this.setState({
            datas: json,
            refreshing: false,
          });
        })
        .catch(() => {});
    }
  };

  handleJoinRoom = id => {
    const { joinRoom } = this.props;
    const { socket } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;
    socket.emit(
      'joinRoom',
      {
        id,
      },
      result => {
        if (result.success) {
          // joinRoom(id);
          // navigate('Game', { socket });
        } else console.log('Full!');
      }
    );
  };

  createSocket = () => {
    const { socket } = this.state;
    const { token } = this.props;
    this.setState({
      gotFocus: true,
    });
    if (socket === undefined) {
      const tokenCode = token.split(' ')[1];
      const socketTmp = io.connect('http://46.101.250.58:4242', {
        query: {
          token: tokenCode,
        },
      });
      socketTmp.on('error', () => {});
      socketTmp.on('connect_failed', () => {});
      socketTmp.on('ready', () => {
        console.log('Ready');
      });
      this.setState({
        socket: socketTmp,
      });
    }
  };

  closeSocket = () => {
    const { socket } = this.state;
    socket.disconnect();
    this.setState({
      socket: undefined,
    });
  };

  render() {
    const { datas, nameRoom, displayDialog, refreshing, nameRoomError } = this.state;
    const { height } = Dimensions.get('window');
    if (datas === undefined) {
      return (
        <Circle
          style={{ flex: 1, alignSelf: 'center', marginTop: height / 2 - 50 }}
          size={100}
          indeterminate
          color="#2c3e50"
        />
      );
    }
    if (displayDialog) {
      return (
        <View>
          <Dialog.Container visible>
            <Dialog.Title>Créer une nouvelle salle</Dialog.Title>
            <Dialog.Description>Veuillez écrire le nom de la salle</Dialog.Description>
            <Dialog.Input
              value={nameRoom}
              label="Nom de la salle"
              onChangeText={name => {
                this.setState({ nameRoom: name });
              }}
            />
            <Text style={Object.assign({}, material.body1, { color: '#e74c3c', marginLeft: 10 })}>
              {nameRoomError ? 'Le champ est obligatoire' : ''}
            </Text>
            <Dialog.Button
              label="Annuler"
              onPress={() => {
                this.setState({ displayDialog: false, nameRoomError: false });
              }}
            />
            <Dialog.Button label="Ajouter" onPress={this.addRoom} />
          </Dialog.Container>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={this.createSocket}
          onWillBlur={payload => {
            if (payload.action.routeName !== 'Game') {
              this.closeSocket();
            }
          }}
        />
        <Text style={Object.assign({}, material.display1, { alignSelf: 'center', marginTop: 20 })}>
          Liste des Salles
        </Text>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.handleRefresh} />}
        >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={Object.assign({}, material.headline, {
                alignSelf: 'flex-end',
                marginLeft: 20,
              })}
            >
              Salle
            </Text>
            <Text
              style={Object.assign({}, material.headline, {
                alignSelf: 'flex-end',
                marginRight: 20,
              })}
            >
              Joueur
            </Text>
          </View>
          {datas.map(it => {
            if (it.playerList.length < 2) {
              return (
                <View
                  key={it.id}
                  style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Text
                    onPress={() => {
                      console.log('Want to join: ', it.name);
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={Object.assign({}, material.title, {
                      width: 150,
                      alignSelf: 'flex-end',
                      marginLeft: 20,
                    })}
                  >
                    {it.name}
                  </Text>
                  <Button
                    icon={<Icon name="md-log-in" type="ionicons" size={20} color="white" />}
                    buttonStyle={{
                      backgroundColor: '#2c3e50',
                      alignSelf: 'center',
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                      marginLeft: 10,
                      marginTop: 10,
                    }}
                    title=""
                    onPress={() => {
                      this.handleJoinRoom(it.id);
                    }}
                  />
                  <Text
                    style={Object.assign({}, material.title, {
                      alignSelf: 'flex-end',
                      marginRight: 20,
                    })}
                  >
                    {it.playerList.length}
                    {'/2'}
                  </Text>
                </View>
              );
            }
            return (
              <View
                key={it.id}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text
                  onPress={() => {
                    console.log('Want to join: ', it.name);
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={Object.assign({}, material.title, {
                    width: 150,
                    alignSelf: 'flex-end',
                    marginLeft: 20,
                  })}
                >
                  {it.name}
                </Text>
                <Text
                  style={Object.assign({}, material.title, {
                    alignSelf: 'flex-end',
                    marginRight: 20,
                  })}
                >
                  {it.playerList.length}
                  {'/2'}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={{ flex: 0.1, justifyContent: 'flex-end', marginBottom: 10 }}>
          <Button
            icon={<Icon name="ios-add" type="ionicons" size={30} color="white" />}
            buttonStyle={{
              backgroundColor: '#2c3e50',
              alignSelf: 'center',
              width: 40,
              height: 40,
              borderRadius: 100,
              marginLeft: 10,
              marginTop: 10,
            }}
            title=""
            onPress={() => {
              this.setState({ displayDialog: true });
            }}
          />
        </View>
      </View>
    );
  }
}

Lobby.propTypes = {
  token: propTypes.string,
  // joinRoom: propTypes.func.isRequired,
};

Lobby.defaultProps = {
  token: '',
};

const mapStateToProps = state => {
  if (state.user) {
    // console.log(state.user);
    return {
      isConnect: true,
      token: state.user.token,
    };
  }
  return {
    isConnect: false,
  };
};

const mapDispatchToProps = dispatch => ({
  // joinRoom: roomid => dispatch(joinRoomDispatch(roomid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
