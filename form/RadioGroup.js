import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import AbstractFormComponent from './AbstractFormComponent';
import Button from '../bootstrap/Button';
import Icon from '../Icon';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
});

/**
 * Radio
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/3
 */
class RadioGroup extends AbstractFormComponent {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      disabled: PropTypes.bool
    })).isRequired,
    renderOption: PropTypes.func,
    selectedOption: PropTypes.string,
    onOptionSelected: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {name, form, selectedOption} = props;
    name && form && form.putFormValue(name, selectedOption);
    this.state = {
      selectedOption
    };
  }

  state = {};

  onOptionSelected(selectedOption) {
    return () => {
      const {onOptionSelected, name, form} = this.props;
      name && form && form.putFormValue(name, selectedOption);
      this.setState({selectedOption});
      onOptionSelected && onOptionSelected(selectedOption);
    };
  }

  renderOption(option, selected) {
    const {value, disabled} = option;
    const Comp = disabled ? View : Button;
    return (
      <Comp bsStyle="link">
        <Icon name={value === selected ? 'check-circle-o' : 'circle-o'}/>
      </Comp>
    );
  }

  render() {

    const {style, options, renderOption, ...other} = this.props;

    const handle = renderOption || this.renderOption;

    return (
      <View {...other}
            style={[styles.container, style]}
      >
        {
          options.map((option, key) => cloneElement(handle(option, this.state.selectedOption), {
            key,
            onPress: this.onOptionSelected(option.value)
          }))
        }
      </View>
    );
  }

}

export default RadioGroup;
