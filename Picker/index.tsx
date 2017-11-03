import * as React from 'react';
import { Picker as RNPicker, PickerIOS, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import AbstractFormComponent from '../Form/AbstractFormComponent';
import Dialog from '../Dialog/index';
import Input from '../Input';
import { Colors, separatorHeight } from '../styles';
import Props from './Props';

const styles = StyleSheet.create<any>({
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
    height: 40,
    paddingHorizontal: 15,
    borderBottomWidth: separatorHeight,
    borderColor: Colors.separator,
    backgroundColor: Colors.underlay
  },
  title: {
    color: '#0977FF',
    fontSize: 16,
    maxHeight: 40,
    minWidth: 10
  }
});


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
class Picker extends AbstractFormComponent<Props, any> {

  static defaultProps = {
    cancelText: '取消',
    confirmText: '确认',
    mode: 'dialog',
    title: ''
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

  currentSelectedValue;

  constructor(props) {
    super(props);
    this.state.selectedValue = props.defaultSelected || props.selectedValue;
  }

  componentWillReceiveProps({selectedValue}) {
    if (this.props.selectedValue !== selectedValue) {
      this.setState({selectedValue});
    }
  }

  handleValueChange(selectedValue) {
    this.setState({selectedValue});
  }

  handleDialogOpen() {
    this.currentSelectedValue = this.state.selectedValue;
    this.handleDialogSwitch();
  }

  handleConfirm() {
    const {onValueChange} = this.props;
    onValueChange && onValueChange(this.state.selectedValue);
    this.handleDialogSwitch();
  }

  handleCancel() {
    this.setState({selectedValue: this.currentSelectedValue});
    this.handleDialogSwitch();
  }

  handleDialogSwitch() {
    this.setState({visible: !this.state.visible});
  }

  getValue() {
    return this.state.selectedValue;
  }

  isValid() {
    return true;
  }

  renderHeader() {
    const {renderHeader, confirmText, cancelText, title} = this.props;
    if (renderHeader) {
      return renderHeader();
    }
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.handleCancel}>
          <Text style={styles.title}>{cancelText}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {fontSize: 18}]}>{title}</Text>
        <TouchableOpacity onPress={this.handleConfirm}>
          <Text style={styles.title}>
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {

    const {editable, children, mode, style, ...other} = this.props;

    if (Platform.OS === 'android') {
      return (
        <RNPicker mode={mode}
                  onValueChange={this.handleValueChange}
                  selectedValue={this.state.selectedValue}
                  style={style}
        >
          {children}
        </RNPicker>
      );
    }

    const props = this.state.visible ? this.contentShowAnimation : this.contentHideAnimation;
    let label = '';
    const childrenArr: Array<any> = React.Children.toArray(children);
    for (let i = 0; i < childrenArr.length; i++) {
      const child = childrenArr[i];
      if (child.props.value === this.state.selectedValue) {
        label = child.props.label;
        break;
      }
    }

    return (
      <TouchableOpacity disabled={editable}
                        onPress={this.handleDialogOpen}
      >
        <Input {...other}
               style={style}
        >
          {label}
        </Input>
        <Dialog hideAnimation={hideAnimation}
                onPress={this.handleCancel}
                showAnimation={showAnimation}
                statusBarAutoHidden={false}
                style={styles.dialogContainer}
                visible={this.state.visible}
        >
          <AnimatableView {...props}
                          style={styles.picker}
          >
            {this.renderHeader()}
            <PickerIOS onValueChange={this.handleValueChange}
                       selectedValue={this.state.selectedValue}
            >
              {children}
            </PickerIOS>
          </AnimatableView>
        </Dialog>
      </TouchableOpacity>
    );
  }


}

export const Item = Platform.select<React.ReactNode>({
  ios: PickerIOS.Item,
  android: RNPicker.Item
});

export default Picker;
