import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  PanResponder,
  requireNativeComponent,
  NativeModules
} from 'react-native';


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
  canvasProps = {
    lines: []
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: this.onStart,
      onPanResponderMove: this.onMove,
      onPanResponderRelease: () => {}
    });
  }

  updateNativeStyles() {
    this.canvasProps.lines = this.lines;
    this.canvas && this.canvas.setNativeProps(this.canvasProps);
  }

  onStart(event) {
    this.points = [];
    this.lines.push(this.points);
    const {locationX, locationY} = event.nativeEvent;
    this.points.push({
      x: locationX,
      y: locationY
    });
    this.updateNativeStyles();
  }

  onMove(event) {
    const {locationX, locationY} = event.nativeEvent;
    this.points.push({
      x: locationX,
      y: locationY
    });
    this.updateNativeStyles();
  }

  capture() {
    return SitbRCTCanvasView.capture();
  }

  clearScreen() {
    this.lines = [];
    SitbRCTCanvasView.clearScreen();
  }

  render() {
    return (
      <RCTCanvas {...this.props}
        {...this.panResponder.panHandlers}
        ref={ref => this.canvas = ref}
      />
    );
  }

}

const RCTCanvas = requireNativeComponent('SitbRCTCanvasView', Canvas);

export default Canvas;
