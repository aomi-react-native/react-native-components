import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text,
  View,
  Platform
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,
    Comp: PropTypes.any,
    children: PropTypes.any,
    containerStyle: View.propTypes.style,
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
    const {
      disabled,
      children,
      renderContent,
      containerStyle,
      onPress,
      activeOpacity,
      onHideUnderlay,
      onShowUnderlay,
      underlayColor
    } = this.props;

    let Comp = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
    if (this.props.Comp) {
      Comp = this.props.Comp;
    }

    return (
      <Comp activeOpacity={activeOpacity}
            disabled={disabled}
            onHideUnderlay={onHideUnderlay}
            onPress={onPress}
            onShowUnderlay={onShowUnderlay}
            style={containerStyle}
            underlayColor={underlayColor}
      >
        {this.renderContent(children, renderContent)}
      </Comp>
    );
  }

}

export default Button;
