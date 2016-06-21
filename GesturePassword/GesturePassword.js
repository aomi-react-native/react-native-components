import React, { PropTypes } from 'react';
import Component from '../AbstractComponent';
import {
  View,
  StyleSheet,
  PanResponder
} from 'react-native';
import Circle from './Circle';
import Line from './Line';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1628'
  },
  circleContainer: {
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
    prevPageX: 0,
    prevPageY: 0,
    // 当前x
    pageX: 0,
    // 当前y
    pageY: 0
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
    Object.keys(this.valueComponents).forEach(key => {
      // noinspection Eslint
      this.valueComponents[key].measure((x, y, width, height, pageX, pageY)=> {
        // noinspection Eslint
        this.valuePosition[key] = {
          min: {
            pageX: pageX,
            pageY: pageY
          },
          max: {
            pageX: pageX + width,
            pageY: pageY + height
          },
          center: {
            pageX: pageX + (width / 2),
            pageY: pageY + (height / 2)
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
      prevPageX: 0,
      prevPageY: 0,
      // 当前x
      pageX: 0,
      // 当前y
      pageY: 0,
      success: true
    };
    this.setState(state);
  }

  /**
   * 判断指定的点是否在圆内
   * @param pageX x
   * @param pageY y
   * @return {*} 如果存在圆内,返回改圆的值
   */
  inCircle(pageX, pageY) {
    let result = null;
    Object.keys(this.valuePosition).forEach(key => {
      const {min, max} = this.valuePosition[key];
      if ((min.pageX <= pageX && min.pageY <= pageY) && (max.pageX >= pageX && max.pageY >= pageY)) {
        result = key;
      }
    });
    return result;
  }

  /**
   * 如果给定的点在密码区域内,则更新密码,同时更新上一个坐标点位置和当前坐标值
   * @param pageX x
   * @param pageY y
   * @param isStart 是否开始绘制
   * @param isEnd 是否是绘制结束
   */
  handle(pageX, pageY, isStart, isEnd) {
    let value = this.inCircle(pageX, pageY);

    const {center} = this.valuePosition[value] || {};

    let {prevPageX, prevPageY, lines} = this.state;
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
            startX: center.pageX,
            startY: center.pageY
          };
          lines.push(newLine);
        } else {
          line.endX = center.pageX;
          line.endY = center.pageY;

          let newLine = {
            startX: line.endX,
            startY: line.endY
          };
          lines.push(newLine);
        }
      } else {
        line = {
          startX: center.pageX,
          startY: center.pageY
        };
        lines.push(line);
      }

      this.password.push(value);
      prevPageX = center.pageX;
      prevPageY = center.pageY;
    }

    if (this.password.length === this.props.passwordValues.length || isEnd) {
      this.reset();
      const {onComplete} = this.props;
      onComplete && onComplete(this.getPassword());
      return;
    }

    this.setState({
      prevPageX,
      prevPageY,
      pageX,
      pageY,
      lines
    });
  }

  onStart(event, gestureState) {
    const {onStart} = this.props;
    const {pageX, pageY} = event.nativeEvent;
    this.handle(pageX, pageY, true, false);
    onStart && onStart(event, gestureState);
  }

  onMove(event, gestureState) {
    const {onMove} = this.props;
    const {pageX, pageY} = event.nativeEvent;
    this.handle(pageX, pageY);
    onMove && onMove(event, gestureState);
  }

  onEnd(event, gestureState) {
    const {onEnd} = this.props;
    const {pageX, pageY} = event.nativeEvent;
    this.handle(pageX, pageY, false, true);
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
      pageX,
      pageY,
      prevPageX,
      prevPageY
    } = this.state;

    const line = {
      startX: prevPageX,
      startY: prevPageY,
      endX: pageX,
      endY: pageY,
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
