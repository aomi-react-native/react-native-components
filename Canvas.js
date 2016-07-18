import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  PanResponder,
  requireNativeComponent,
  NativeModules,
  Platform,
  PixelRatio
} from 'react-native';

const ratio = PixelRatio.get();

const {
  SitbRCTCanvasView
} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/14
 */
class Canvas extends Component {

  static propTypes = {
    ...View.propTypes,
    lineWidth: PropTypes.number,
    lines: PropTypes.array,
    strokeColor: PropTypes.string
  };

  static defaultProps = {
    lineWidth: 2,
    strokeColor: 'black'
  };

  // refs
  canvas;

  panResponder;
  points:Array;
  lines = [];

  constructor(props) {
    super(props);
    this.state = {
      lineWidth: props.lineWidth * ratio
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: () => {}
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({lineWidth: nextProps.lineWidth});
  }

  setNativeProps(props) {
    console.log(props);
    this.canvas && this.canvas.setNativeProps(props);
  }

  handlePanResponderGrant(event, gestureState) {
    const {touchStart} = this.props;
    if (touchStart) {
      touchStart(event, gestureState);
    } else {
      this.points = [];
      this.lines.push(this.points);
      this.points.push(this.handlePoint(event, gestureState));
      this.setNativeProps({lines: this.lines});
    }
  }

  handlePanResponderMove(event, gestureState) {
    const {touchMove} = this.props;
    if (touchMove) {
      touchMove(event, gestureState);
    } else {
      this.points.push(this.handlePoint(event, gestureState));
      this.setNativeProps({lines: this.lines});
    }
  }

  handlePoint(event, gestureState) {
    const {dx, dy} = gestureState;
    const {locationX, locationY} = event.nativeEvent;

    if (Platform.OS === 'android') {
      return {
        x: (locationX + dx ) * PixelRatio.get(),
        y: (locationY + dy) * PixelRatio.get()
      };
    }

    return {
      x: locationX,
      y: locationY
    };
  }

  capture() {
    return SitbRCTCanvasView.capture();
  }

  clearScreen() {
    this.lines = [];
    this.setNativeProps({lines: []});
  }

  render() {
    return (
      <RCTCanvas {...this.props}
        {...this.panResponder.panHandlers}
        lineWidth={this.state.lineWidth}
        ref={ref => this.canvas = ref}
      />
    );
  }

}

const RCTCanvas = requireNativeComponent('SitbRCTCanvasView', Canvas);

export default Canvas;
