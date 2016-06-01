import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  View,
  Text
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    activeOpacity: PropTypes.number,
    children: PropTypes.any,
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
      ...other
    } = this.props;

    let Comp = disabled ? View : TouchableOpacity;

    return (
      <Comp {...other}>
        {this.renderContent(children, renderContent)}
      </Comp>
    );
  }

}

export default Button;
