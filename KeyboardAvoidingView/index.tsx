import * as React from 'react';
import Component from '../AbstractComponent';
import { Keyboard, LayoutAnimation, Platform, ScrollView } from 'react-native';
import Props from './Props';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/7/27
 */
export default class KeyboardAvoidingView extends Component<Props> {
  static defaultProps = {
    keyboardBottomOffset: 15,
  };

  // refs
  scrollView;

  subscriptions = [];
  frame;

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardChange),
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener('keyboardDidHide', this.onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', this.onKeyboardChange),
      ];
    }
  }

  onKeyboardChange(event) {
    if (!this.scrollView) {
      return;
    }
    if (!event) {
      this.scrollView.scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });
      return;
    }

    const { duration, easing, endCoordinates } = event;
    const height = this.relativeKeyboardHeight(endCoordinates);

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration,
        update: {
          duration,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.scrollView.scrollTo({
      x: 0,
      y: height,
      animated: true,
    });
  }

  relativeKeyboardHeight(keyboardFrame): number {
    const frame = this.frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    const keyboardY =
      keyboardFrame.screenY +
      keyboardFrame.height -
      this.props.keyboardBottomOffset;

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard
    return Math.max(frame.y + frame.height - keyboardY, 0);
  }

  onLayout(event) {
    this.frame = event.nativeEvent.layout;
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <ScrollView
        {...props}
        onLayout={this.onLayout}
        ref={scrollView => (this.scrollView = scrollView)}>
        {children}
      </ScrollView>
    );
  }
}
