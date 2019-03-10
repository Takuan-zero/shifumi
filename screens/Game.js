import React from 'react';
import io from 'socket.io-client/dist/socket.io';
import { Text, View, BackHandler, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TimerCountdown from 'react-native-timer-countdown';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import Dialog from 'react-native-dialog';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: 'row',
    bottom: '0%',
    position: 'absolute',
  },
  button: {
    backgroundColor: '#7a42f4',
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    height: 40,
    borderRadius: 3,
    bottom: '0%',
  },
  buttonText: {
    color: 'white',
  },
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.animed = new Animated.Value(0);
    const { socket } = this.props;
    this.state = {
      socket,
      waiting: true,
      timer: 0,
      played: false,
      loadingData: false,
      score: 0,
      scoreAdv: 0,
      round: 1,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const { socket, score, scoreAdv, round } = this.state;
    BackHandler.addEventListener('hardwareBackPress', () => {
      socket.emit('exitRoom', {}, () => {});
      Actions.pop();
      return true;
    });
    if (socket) {
      socket.on('roundStart', data => {
        const { duration } = data;
        this.setState({ waiting: false, timer: duration, loadingData: false });
      });
      socket.on('roundEnd', data => {
        const { winner } = data;
        if (winner) {
          const { userId } = winner;
          if (userId === user.id) {
            let tmpScore = score;
            tmpScore += 1;
            this.setState({ score: tmpScore });
          } else {
            let tmpScoreAdv = scoreAdv;
            tmpScoreAdv += 1;
            this.setState({ scoreAdv: tmpScoreAdv });
          }
          let tmpRound = round;
          tmpRound += 1;
          this.setState({
            round: tmpRound,
            waiting: false,
            loadingData: true,
          });
        } else {
          let tmpRound = round;
          tmpRound += 1;
          this.setState({ round: tmpRound, waiting: false, loadingData: false });
        }
      });
      socket.on('gameEnd', () => {
        this.setState({ gameEnd: true, loadingData: false });
        socket.emit('exitRoom', {}, () => {});
      });
    }
  }

  playSign = sign => {
    const { socket } = this.state;
    if (socket) {
      socket.emit(
        'playSign',
        {
          sign,
        },
        () => {}
      );
      this.setState({
        played: true,
        waiting: true,
        loadingData: true,
      });
    }
  };

  goToLobbyScreen = () => {
    Actions.pop();
  };

  render() {
    const { waiting, gameEnd, timer, played, score, scoreAdv, round, loadingData } = this.state;
    if (waiting) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 1, alignSelf: 'center', marginTop: 300 }}>
            {played ? 'En attente du choix du joueur adverse' : 'En attente de joueur'}
            <AnimatedEllipsis />
          </Text>
        </View>
      );
    }
    if (gameEnd) {
      let result;
      if (score === scoreAdv) result = 'Egalité dommage';
      else if (score > scoreAdv) result = 'Vous avez gagné le match';
      else result = 'Vous avez perdu le match';
      return (
        <View>
          <Dialog.Container visible>
            <Dialog.Title>Fin de partie</Dialog.Title>
            <Dialog.Description>{result}</Dialog.Description>
            <Dialog.Button label="Ok" onPress={this.goToLobbyScreen} />
          </Dialog.Container>
        </View>
      );
    }
    if (loadingData) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 1, alignSelf: 'center', marginTop: 300 }}>
            Chargement des données
            <AnimatedEllipsis />
          </Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <TimerCountdown
          initialMilliseconds={timer * 1000}
          allowFontScaling
          style={{
            fontSize: 20,
            alignSelf: 'center',
            marginTop: 100,
          }}
        />
        <Text style={{ alignSelf: 'center' }}>Round {round}</Text>
        <Text style={{ alignSelf: 'center' }}>
          {score} :{scoreAdv}
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={() => this.playSign('rock')}>
            <Text style={styles.buttonText}>Pierre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.playSign('paper')}>
            <Text style={styles.buttonText}>Feuille</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.playSign('scissors')}>
            <Text style={styles.buttonText}>Ciseau</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Game.propTypes = {
  user: propTypes.shape({
    id: propTypes.number,
  }).isRequired,
  socket: propTypes.instanceOf(io.Socket).isRequired,
};

Game.defaultProps = {};

const mapDispatchToProps = () => ({});

const mapStateToProps = state => ({
  player: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
