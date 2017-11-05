import * as React from 'react';
import * as PropTypes from 'prop-types';
import Component from '../AbstractComponent';
import { NativeModules, PanResponder, PixelRatio, Platform, requireNativeComponent } from 'react-native';
import Props from './Props';

const ratio = PixelRatio.get();


// UIManager.dispatchViewManagerCommand

const {
  SitbRCTCanvasView
} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/14
 */
class Canvas extends Component<Props> {

  static propTypes = {
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
  points = [];
  lines = [];

  state;

  constructor(props) {
    super(props);
    this.state = {
      lineWidth: this.getLineWidth(props.lineWidth)
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
      onPanResponderRelease: () => {
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({lineWidth: this.getLineWidth(nextProps.lineWidth)});
  }

  getLineWidth(width) {
    return Platform.OS === 'android' ? width * ratio : width;
  }

  setNativeProps(props) {
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
        x: (locationX + dx) * PixelRatio.get(),
        y: (locationY + dy) * PixelRatio.get()
      };
    }

    return {
      x: locationX,
      y: locationY
    };
  }

  capture(mimeType = 'png') {
    if (Platform.OS === 'android') {
      return new Promise((resolve, reject) => {
        reject('安卓平台暂未实现该功能');
      });
    }
    return SitbRCTCanvasView.capture(mimeType);
  }

  clearScreen() {
    this.lines = [];
    this.setNativeProps({lines: []});
  }

  handleChange() {
    // do something...
  }

  render() {
    return (
      <RCTCanvas {...this.props}
                 {...this.panResponder.panHandlers}
                 lineWidth={this.state.lineWidth}
                 onChange={this.handleChange}
                 ref={ref => this.canvas = ref}
      />
    );
  }

}

const RCTCanvas = requireNativeComponent('SitbRCTCanvasView', Canvas, {
  nativeOnly: {
    onChange: true
  }
});

export default Canvas;
