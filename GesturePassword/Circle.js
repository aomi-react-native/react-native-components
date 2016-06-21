import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Component from '../AbstractComponent';

const defaultCircleSize = 60;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    borderRadius: 50,
    borderColor: '#15617F',
    borderWidth: 2,
    width: defaultCircleSize,
    height: defaultCircleSize,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerCircle: {
    width: 25,
    height: 25,
    borderRadius: 59,
    backgroundColor: '#15617F'
  },
  circleSelected: {}
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/20
 */
class Circle extends Component {

  static propTypes = {
    circleStyle: View.propTypes.style,
    innerCircleStyle: View.propTypes.style,
    selected: PropTypes.bool,
    selectedStyle: View.propTypes.style,
    style: View.propTypes.style
  };

  // refs
  circle;

  measureLayout(relativeToNativeNode, handle) {
    this.circle && this.circle.measureLayout(relativeToNativeNode, handle);
  }

  render() {

    const {selected, style, circleStyle, innerCircleStyle} = this.props;

    return (
      <View style={[styles.container, style]}>
        <View ref={circle => this.circle = circle}
              style={[styles.circle, circleStyle]}
        >
          {
            selected ? (
              <View style={[styles.innerCircle, innerCircleStyle]}/>
            ) : null
          }
        </View>
      </View>
    );
  }

}
export default Circle;
