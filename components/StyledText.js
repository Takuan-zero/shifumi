import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

export class MonoText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iTest: 10,
    };
  }

  render() {
    const { style } = this.props;
    const { iTest } = this.state;
    if (iTest === 10) return <Text {...this.props} style={[style, { fontFamily: 'space-mono' }]} />;
    return <Text {...this.props} style={[style, { fontFamily: 'space-mono' }]} />;
  }
}

MonoText.propTypes = {
  style: PropTypes.string.isRequired,
};

export default MonoText;
