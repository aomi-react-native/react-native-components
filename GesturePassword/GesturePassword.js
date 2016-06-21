import React, { PropTypes } from 'react';
import Component from '../AbstractComponent';
import {
  View,
  StyleSheet,
  PanResponder,
  findNodeHandle
} from 'react-native';
import Circle from './Circle';
import Line from './Line';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1628'
  },
  circleContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});


/**
 * 手势密码
 * @author Sean sean.snow@live.com
 */
class GesturePassword extends Component {

  static propTypes = {
    circleContainerStyle: View.propTypes.style,
    circleSelectedStyle: View.propTypes.style,
    circleStyle: View.propTypes.style,
    innerCircleStyle: View.propTypes.style,
    passwordValues: PropTypes.array,
    style: View.propTypes.style,
    successColor: PropTypes.string,
    wrongColor: PropTypes.string,
    onComplete: PropTypes.func,
    onEnd: PropTypes.func,
    onMove: PropTypes.func,
    onStart: PropTypes.func
  };

  static defaultProps = {
    passwordValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    successColor: '#15617F',
    wrongColor: '#FF0000'
  };

  state = {
    lines: [],
    cellSize: {},
    success: true,
    prevX: 0,
    prevY: 0,
    // 当前x
    x: 0,
    // 当前y
    y: 0
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: this.onStart,
      onPanResponderMove: this.onMove,
      onPanResponderRelease: this.onEnd
    });
  }

  componentDidMount() {
    setTimeout(this.measure, 100);
  }

  // refs
  line;

  panResponder;

  valuePosition = {};

  valueComponents = {};
  password = [];


  /**
   * 计算圆位置
   */
  measure() {
    let handle = findNodeHandle(this);
    Object.keys(this.valueComponents).forEach(key => {
      // noinspection Eslint
      this.valueComponents[key].measureLayout(handle, (x, y, width, height)=> {
        // noinspection Eslint
        this.valuePosition[key] = {
          min: {
            x,
            y
          },
          max: {
            x: x + width,
            y: y + height
          },
          center: {
            x: x + (width / 2),
            y: y + (height / 2)
          }
        };

      });
    });
  }

  /**
   * 获取手势密码
   * @return {string} 手势密码
   */
  getPassword() {
    return this.password.join('');
  }

  setSuccess(success) {
    this.setState({success});
  }

  reset() {
    let state = {
      prevX: 0,
      prevY: 0,
      // 当前x
      x: 0,
      // 当前y
      y: 0,
      success: true
    };
    this.setState(state);
  }

  /**
   * 判断指定的点是否在圆内
   * @param x x
   * @param y y
   * @return {*} 如果存在圆内,返回改圆的值
   */
  inCircle(x, y) {
    let result = null;
    Object.keys(this.valuePosition).forEach(key => {
      const {min, max} = this.valuePosition[key];
      if ((min.x <= x && min.y <= y) && (max.x >= x && max.y >= y)) {
        result = key;
      }
    });
    return result;
  }

  /**
   * 如果给定的点在密码区域内,则更新密码,同时更新上一个坐标点位置和当前坐标值
   * @param x x
   * @param y y
   * @param isStart 是否开始绘制
   * @param isEnd 是否是绘制结束
   */
  handle(x, y, isStart, isEnd) {
    let value = this.inCircle(x, y);

    const {center} = this.valuePosition[value] || {};

    let {prevX, prevY, lines} = this.state;
    if (isStart) {
      this.reset();
      this.password = [];
      lines = [];
    }

    let line = lines[lines.length - 1] || {};

    if (value && this.password.indexOf(value) === -1) {
      /**
       * 如果有起始点和结束点则新增一条线,设置起始点为当前点中心
       * 如果有起始点没有结束点,则设置结束点为当前点中心点
       * 如果没有起始点则新增一条线,设置起始点为当前点中心点
       */
      if (line.startX) {
        if (line.endX) {
          let newLine = {
            startX: center.x,
            startY: center.y
          };
          lines.push(newLine);
        } else {
          line.endX = center.x;
          line.endY = center.y;

          let newLine = {
            startX: line.endX,
            startY: line.endY
          };
          lines.push(newLine);
        }
      } else {
        line = {
          startX: center.x,
          startY: center.y
        };
        lines.push(line);
      }

      this.password.push(value);
      prevX = center.x;
      prevY = center.y;
    }

    if (this.password.length === this.props.passwordValues.length || isEnd) {
      this.reset();
      const {onComplete} = this.props;
      onComplete && onComplete(this.getPassword());
      return;
    }

    this.setState({
      prevX,
      prevY,
      x,
      y,
      lines
    });
  }

  onStart(event, gestureState) {
    const {onStart} = this.props;
    const {locationX, locationY} = event.nativeEvent;
    this.handle(locationX, locationY, true, false);
    onStart && onStart(event, gestureState);
  }

  onMove(event, gestureState) {
    const {onMove} = this.props;
    const {locationX, locationY} = event.nativeEvent;
    this.handle(locationX, locationY);
    onMove && onMove(event, gestureState);
  }

  onEnd(event, gestureState) {
    const {onEnd} = this.props;
    const {locationX, locationY} = event.nativeEvent;
    this.handle(locationX, locationY, false, true);
    onEnd && onEnd(event, gestureState);
  }

  handleLayout(event) {
    const {width} = event.nativeEvent.layout;
    const size = width / 3;
    this.setState({
      cellSize: {
        width: size,
        height: size
      }
    });
  }

  renderCircle(value, index) {
    const {
      circleSelectedStyle,
      circleStyle,
      circleContainerStyle,
      wrongColor,
      innerCircleStyle
    } = this.props;

    let selected = this.password.indexOf(`${value}`) > -1;

    let circleColor,
      innerCircleStyleTmp;
    if (!this.state.success && selected) {
      circleColor = {
        borderColor: wrongColor
      };
      innerCircleStyleTmp = {
        backgroundColor: wrongColor
      };
    }


    return (
      <Circle circleStyle={[circleStyle, circleColor]}
              innerCircleStyle={[innerCircleStyle, innerCircleStyleTmp]}
              key={index}
              ref={circle => this.valueComponents[value] = circle}
              selected={selected}
              selectedStyle={circleSelectedStyle}
              style={[circleContainerStyle, this.state.cellSize]}
      />
    );
  }

  renderLines(line, index) {
    const {successColor, wrongColor} = this.props;
    const {success} = this.state;
    if (line.startX && line.endX) {
      const color = success ? successColor : wrongColor;
      return (
        <Line {...line}
          color={color}
          key={index}
        />
      );
    }
    return null;
  }

  render() {
    const {
      style,
      successColor,
      passwordValues
    } = this.props;

    const {
      lines,
      x,
      y,
      prevX,
      prevY
    } = this.state;

    const line = {
      startX: prevX,
      startY: prevY,
      endX: x,
      endY: y,
      color: successColor
    };

    return (
      <View style={[styles.container, style]}>
        <View {...this.panResponder.panHandlers}
          onLayout={this.handleLayout}
          style={styles.circleContainer}
        >
          {passwordValues.map(this.renderCircle)}
          {lines.map(this.renderLines)}
          <Line {...line}
            ref={line => this.line = line}
          />
        </View>
      </View>
    );
  }

}

export default GesturePassword;
