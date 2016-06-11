import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Text,
  Platform
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    activeOpacity: PropTypes.number,
    children: PropTypes.any,
    Comp: PropTypes.any,
    disabled: PropTypes.bool,
    renderContent: PropTypes.func
  };

  static defaultProps = {
    disabled: false
  };

  renderContent(children, renderContent) {
    if (renderContent) {
      return renderContent();
    }

    if (typeof children === 'string' ||
      (Array.isArray(children) && typeof children[0] === 'string')) {
      return (
        <Text>{Array.isArray(children) ? children[0] : children}</Text>
      );
    }
    return <Text />;
  }


  render() {
    let {
      disabled,
      children,
      renderContent,
      onPress
    } = this.props;

    let Comp;
    if (this.props.Comp) {
      Comp = this.props.Comp;
    } else {
      Comp = disabled ? View : Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
    }

    return (
      <Comp onPress={onPress}>
        {this.renderContent(children, renderContent)}
      </Comp>
    );
  }

}

export default Button;
