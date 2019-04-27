import * as React from 'react';
import * as PropTypes from 'prop-types';
import { View } from 'react-native';
import AbstractFormComponent from '../Form/AbstractFormComponent';
import { RadioGroupProps } from './Props';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/3/2
 */
export class RadioGroup extends AbstractFormComponent<RadioGroupProps, any> {

  static childContextTypes = {
    onChange: PropTypes.func,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    checked: PropTypes.any
  };

  static defaultProps = {
    labelPosition: 'right'
  };

  state;

  constructor(props) {
    super(props);
    this.state = {
      checked: props.defaultChecked || props.checked
    };
  }

  getChildContext() {
    return {
      onChange: this.handleChange,
      labelPosition: this.props.labelPosition,
      checked: this.state.checked
    };
  }

  componentWillReceiveProps({checked}) {
    if (this.props.checked !== checked) {
      this.setState({checked});
    }
  }

  handleChange(checked) {
    this.setState({checked});
    const {onChange} = this.props;
    onChange && onChange(checked);
  }

  getValue(): any {
    return this.state.checked;
  }

  isValid(): boolean {
    return true;
  }

  render() {
    const {children, ...props} = this.props;
    return (
      <View {...props}>
        {children}
      </View>
    );
  }

}
