import React, { Children, PropTypes } from 'react';
import { Picker as RNPicker, PickerIOS, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import AbstractFormComponent from './AbstractFormComponent';
import Dialog from '../Dialog';
import Input from './Input';
import { Colors } from '../styles';

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'flex-end'
  },
  picker: {
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.underlay
  },
  finish: {}
});


const PickerComponent = Platform.OS === 'ios' ? PickerIOS : RNPicker;

const showAnimation = {
  animation: 'fadeIn',
  duration: 200
};
const hideAnimation = {
  animation: 'fadeOut',
  duration: 500
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/8
 */
class Picker extends AbstractFormComponent {

  static propTypes = {
    children: PropTypes.node,
    defaultSelected: PropTypes.any
  };

  state = {
    visible: false,
    selectedValue: null
  };

  contentShowAnimation = {
    animation: 'fadeInUpBig',
    duration: 500
  };

  contentHideAnimation = {
    animation: 'fadeOutDownBig',
    duration: 500
  };

  constructor(props) {
    super(props);
    this.state.selectedValue = props.defaultSelected;
  }

  handleValueChange(selectedValue) {
    this.setState({selectedValue});

  }

  handleDialogSwitch() {
    this.setState({visible: !this.state.visible});
  }

  getValue() {
    return this.state.selectedValue;
  }

  valid() {
    return true;
  }

  renderHeader() {
    const {renderHeader, placeholder} = this.props;
    if (renderHeader) {
      return renderHeader();
    }
    return (
      <View style={styles.header}>
        <Text>{placeholder}</Text>
        <TouchableOpacity onPress={this.handleDialogSwitch}
                          style={styles.finish}
        >
          <Text style={{
            color: '#0977FF',
            fontSize: 14
          }}
          >
            {'完成'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {children, editable, ...other} = this.props;
    const props = this.state.visible ? this.contentShowAnimation : this.contentHideAnimation;
    let label = '';
    const childrenArr = Children.toArray(children);
    for (let i = 0; i < childrenArr.length; i++) {
      const child = childrenArr[i];
      if (child.props.value === this.state.selectedValue) {
        label = child.props.label;
      }
    }
    return (
      <TouchableOpacity disabled={editable}
                        onPress={this.handleDialogSwitch}
      >
        <Input {...other}
               defaultValue={label}
               editable={false}
        />
        <Dialog hideAnimation={hideAnimation}
                onPress={this.handleDialogSwitch}
                showAnimation={showAnimation}
                statusBarAutoHidden={false}
                style={styles.dialogContainer}
                visible={this.state.visible}
        >
          <AnimatableView {...props}
                          style={styles.picker}
          >
            {this.renderHeader()}
            <PickerComponent onValueChange={this.handleValueChange}
                             selectedValue={this.state.selectedValue}
            >
              {children}
            </PickerComponent>
          </AnimatableView>
        </Dialog>
      </TouchableOpacity>
    );
  }


}

Picker.Item = PickerComponent.Item;

export default Picker;
