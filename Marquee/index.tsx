import * as React from 'react';
import Component from '../AbstractComponent';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';
import Props from './Props';

function until(test, iterator, callback) {
  if (test()) {
    return callback();
  }
  iterator((err) => {
    if (err) {
      return callback(err);
    }
    return until(test, iterator, callback);
  });
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/24
 */
export default class Marquee extends Component<Props> {

  static defaultProps = {
    speed: 30,
    spaceRatio: 0.5
  };

  state;
  alpha;
  animateEnable;
  width;
  twidth;
  spaceWidth;

  constructor(props) {
    super(props);
    this.alpha = {};
    this.state = {
      left1: new Animated.Value(0),
      left2: new Animated.Value(0),
      list: props.children.split('')
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.animateEnable = false;
      this.width = 0;
      this.state.left1.stopAnimation(() => {
        this.state.left2.stopAnimation(() => {
          Animated.timing(this.state.left1, {
            toValue: 0,
            duration: 0,
          }).start(() => {
            Animated.timing(this.state.left2, {
              toValue: this.width,
              duration: 0
            }).start(() => {
              this.setState({list: nextProps.children.split('')});
            });
          });
        });
      });
    }
  }

  onLayout(i) {
    return (e) => {
      this.alpha[i] = e.nativeEvent.layout.width;
      if (_.size(this.alpha) === this.state.list.length) {
        this.twidth = _.sum(_.values(this.alpha));
        this.alpha = {};
        if (!this.animateEnable) {
          this.animateEnable = true;
          until(
            () => this.width > 0,
            (cb) => setTimeout(cb, 100),
            () => this.startMoveFirstLabelHead()
          );
        }
      }
    }
  }

  onLayoutContainer(e) {
    if (!this.width) {
      this.width = e.nativeEvent.layout.width;
      this.spaceWidth = this.props.spaceRatio * this.width;
      this.setState({left1: new Animated.Value(0)});
      this.setState({left2: new Animated.Value(this.width)});
    }
  }

  startMoveFirstLabelHead() {
    const {twidth, props} = this;
    const {speed} = props;
    Animated.timing(this.state.left1, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth - this.spaceWidth) * speed,
      easing: Easing.linear,
      delay: 500,
    }).start(() => {
      if (this.animateEnable) {
        this.moveFirstLabelTail();
        this.moveSecondLabelHead();
      }
    });
  }

  moveFirstLabelHead() {
    const {twidth, props} = this;
    const {speed} = props;
    Animated.timing(this.state.left1, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth + this.spaceWidth) * speed,
      easing: Easing.linear,
    }).start(() => {
      if (this.animateEnable) {
        this.moveFirstLabelTail();
        this.moveSecondLabelHead();
      }
    });
  }

  moveFirstLabelTail() {
    const {width, twidth, props} = this;
    const {speed} = props;
    Animated.timing(this.state.left1, {
      toValue: -twidth,
      duration: this.spaceWidth * speed,
      easing: Easing.linear,
    }).start(() => {
      this.animateEnable && this.setState({left1: new Animated.Value(width)});
    });
  }

  moveSecondLabelHead() {
    const {twidth, props} = this;
    const {speed} = props;
    Animated.timing(this.state.left2, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth + this.spaceWidth) * speed,
      easing: Easing.linear,
    }).start(() => {
      if (this.animateEnable) {
        this.moveFirstLabelHead();
        this.moveSecondLabelTail();
      }
    });
  }

  moveSecondLabelTail() {
    const { twidth, props} = this;
    const {speed} = props;
    Animated.timing(this.state.left2, {
      toValue: -twidth,
      duration: this.spaceWidth * speed,
      easing: Easing.linear
    }).start(() => {
      this.animateEnable && this.setState({left2: new Animated.Value(twidth)});
    });
  }

  render() {
    const {left1, left2, list} = this.state;
    const s = StyleSheet.flatten(this.props.style);
    const textStyleKeys = ['color', 'fontSize', 'fontWeight', 'letterSpacing', 'fontStyle', 'lineHeight', 'fontFamily', 'textDecorationLine'];
    const textStyle = _.pick(s, textStyleKeys);
    const containerStyle = _.omit(s, textStyleKeys);
    return (
      <View onLayout={this.onLayoutContainer}
            style={[containerStyle, {flexDirection: 'row'}]}
      >
        <Animated.View style={{
          flexDirection: 'row',
          left: left1
        }}>
          {list.map((o, i) => (<Text key={i} onLayout={this.onLayout(i)} style={textStyle}>{o}</Text>))}
        </Animated.View>
        <Animated.View style={{
          flexDirection: 'row',
          position: 'absolute',
          left: left2
        }}>
          {list.map((o, i) => (<Text key={i} style={textStyle}>{o}</Text>))}
        </Animated.View>
      </View>
    );
  }

}
