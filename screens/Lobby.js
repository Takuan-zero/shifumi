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
import io from 'socket.io-client/dist/socket.io';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';
import { Button } from 'react-native-elements';
import { Circle } from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import Dialog from 'react-native-dialog';

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
    const { jwt } = this.props;
    const tokenCode = jwt.split(' ')[1];
    const socketTmp = io('http://46.101.250.58:4242', {
      query: {
        token: tokenCode,
      },
    });
    socketTmp.on('error', () => {});
    socketTmp.on('connect_failed', () => {});
    socketTmp.on('ready', () => {});
    this.state = {
      socket: socketTmp,
      datas: undefined,
      refreshing: false,
      nameRoom: '',
      gotFocus: false,
    };
  }

  componentDidMount() {
    const { jwt } = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { socket } = this.state;
      if (socket) {
        socket.disconnect();
      }
      BackHandler.exitApp();
      return true;
    });
    if (jwt !== '') {
      fetch('http://46.101.250.58:3000/rooms', {
        method: 'GET',
        headers: {
          Authorization: jwt,
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
    if (gotFocus) {
      this.handleRefresh();
    }
  }

  addRoom = () => {
    const { socket, nameRoom } = this.state;
    const { id } = this.props;
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
          if (data.success) {
            this.setState({
              displayDialog: false,
            });
            Actions.push('Game', { socket, user: { id } });
          }
        }
      );
    } else
      this.setState({
        nameRoomError: true,
      });
  };

  handleRefresh = () => {
    const { jwt } = this.props;
    const { gotFocus } = this.state;
    this.setState({
      refreshing: true,
    });
    if (gotFocus)
      this.setState({
        gotFocus: false,
      });
    if (jwt !== '') {
      fetch('http://46.101.250.58:3000/rooms', {
        method: 'GET',
        headers: {
          Authorization: jwt,
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

  handleJoinRoom = roomId => {
    const { socket } = this.state;
    const { id } = this.props;
    socket.emit(
      'joinRoom',
      {
        id: roomId,
      },
      result => {
        if (result.success) {
          Actions.push('Game', { socket, user: { id } });
        }
      }
    );
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
        <Text style={Object.assign({}, { alignSelf: 'center', marginTop: 20 })}>
          Liste des Salles
        </Text>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.handleRefresh} />}
        >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={Object.assign(
                {},
                {
                  alignSelf: 'flex-end',
                  marginLeft: 20,
                }
              )}
            >
              Salle
            </Text>
            <Text
              style={Object.assign(
                {},
                {
                  alignSelf: 'flex-end',
                  marginRight: 20,
                }
              )}
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
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={Object.assign(
                      {},
                      {
                        width: 150,
                        alignSelf: 'flex-end',
                        marginLeft: 20,
                      }
                    )}
                  >
                    {it.name}
                  </Text>
                  <Button
                    icon={<Icon name="md-log-in" type="ionicons" size={18} color="white" />}
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
                    style={Object.assign(
                      {},
                      {
                        alignSelf: 'flex-end',
                        marginRight: 20,
                      }
                    )}
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
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={Object.assign(
                    {},
                    {
                      width: 150,
                      alignSelf: 'flex-end',
                      marginLeft: 20,
                    }
                  )}
                >
                  {it.name}
                </Text>
                <Text
                  style={Object.assign(
                    {},
                    {
                      alignSelf: 'flex-end',
                      marginRight: 20,
                    }
                  )}
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
  jwt: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

Lobby.defaultProps = {};

const mapStateToProps = state => {
  if (state.user) {
    return {
      isConnect: true,
      token: state.user.token,
    };
  }
  return {
    isConnect: false,
  };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
