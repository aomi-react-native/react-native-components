import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  container: {},
  content: {},
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/17
 */
class PickerContainer extends Component {

  static propTypes = {
    children: PropTypes.node
  };

  render() {
    let {children} = this.props;
    return (
      <View style={[styles.container]}>
        <Animatable.View animation="fadeIn"
                         style={[styles.absolute,styles.background]}
        />
        <Animatable.View style={[styles.content]}>
          {children}
        </Animatable.View>
      </View>
    );
  }

}

export default PickerContainer;
