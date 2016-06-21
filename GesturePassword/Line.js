import React, { PropTypes } from 'react';
import { View } from 'react-native';
import Component from '../AbstractComponent';
import utils from './utils';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/20
 */
class Line extends Component {

  static propTypes = {
    color: PropTypes.string,
    endX: PropTypes.number,
    endY: PropTypes.number,
    startX: PropTypes.number,
    startY: PropTypes.number
  };

  static defaultProps = {
    color: '#000',
    endX: 0,
    endY: 0,
    startX: 0,
    startY: 0
  };

  // refs
  line;

  setNativeProps(props) {
    this.line.setNativeProps(props);
  }

  render() {

    const {
      color,
      startX,
      startY,
      endX,
      endY
    } = this.props;

    if (startX === 0 && startY === 0) {
      return null;
    }

    let transform = utils.calTransform(startX, startY, endX, endY);

    const lineStyle = {
      position: 'absolute',
      backgroundColor: color,
      left: startX,
      top: startY,
      width: transform.distance,
      height: 1,
      transform: [{
        translateX: transform.translateX
      }, {
        translateY: transform.translateY
      }, {
        rotateZ: `${transform.angle || 0}rad`
      }]
    };

    return (
      <View {...this.props}
        ref={line => this.line = line}
        style={lineStyle}
      />
    );
  }

}

export default Line;
