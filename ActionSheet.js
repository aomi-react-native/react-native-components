import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import RootSiblings from 'react-native-root-siblings';
import Component from './AbstractComponent';
import Button from './Button';
import Dialog from './Dialog';
import { Colors, separatorHeight } from './styles';

const height = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'flex-end'
  },
  contentContainer: {
    margin: 10
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  title: {
    height,
    justifyContent: 'center',
    borderColor: Colors.separator,
    borderBottomWidth: separatorHeight
  },
  titleText: {
    color: '#8F8F91',
    textAlign: 'center',
    fontSize: 16
  },
  button: {
    borderRadius: 0,
    height,
    borderColor: Colors.separator,
    borderBottomWidth: separatorHeight
  },
  cancel: {
    marginTop: 10,
    height,
    justifyContent: 'center',
    borderWidth: 0
  },
  cancelText: {
    fontWeight: '700',
    color: '#0977FF',
    fontSize: 18
  }
});


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/12
 */
class ActionSheetComponent extends Component {

  static propTypes = {
    /**
     * （字符串数组） - 一组按钮的标题（必选）
     */
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      textColor: PropTypes.string,
      onPress: PropTypes.func
    })).isRequired,

    cancel: PropTypes.string,
    cancelPress: PropTypes.func,

    manager: PropTypes.object,
    /**
     * （字符串） - 弹出框顶部标题下方的信息
     */
    message: PropTypes.string,

    // （字符串） - 弹出框顶部的标题
    title: PropTypes.string
  };

  state = {
    open: true
  };

  showAnimation = {
    animation: 'fadeIn',
    duration: 500
  };

  hideAnimation = {
    animation: 'fadeOut',
    duration: 500
  };

  contentShowAnimation = {
    animation: 'fadeInUpBig',
    duration: 500
  };
  contentHideAnimation = {
    animation: 'fadeOutDownBig',
    duration: 500
  };

  handleCancelPress() {
    const {cancelPress} = this.props;
    this.close(cancelPress);
  }

  handlePress(onPress) {
    return () => {
      this.close(onPress);
    };
  }

  close(onPress) {
    this.setState({open: false}, () => {
      setTimeout(() => {
        onPress && onPress();
        this.props.manager.destroy();
      }, 600);
    });
  }

  render() {

    const props = this.state.open ? this.contentShowAnimation : this.contentHideAnimation;

    const {
      options,
      title,
      cancel
    } = this.props;

    const {
      height
    } = Dimensions.get('window');

    return (
      <Dialog hideAnimation={this.hideAnimation}
              onPress={this.handleCancelPress}
              showAnimation={this.showAnimation}
              statusBarAutoHidden={false}
              style={styles.container}
              visible={this.state.open}
      >
        <AnimatableView {...props}
                        style={styles.contentContainer}
        >
          <View style={[styles.content]}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{title || 'Action'}</Text>
            </View>
            <ScrollView alwaysBounceVertical={false}
                        style={{maxHeight: height * 0.6}}
            >
              {options.map((option, index) => {
                let tmp = null;
                if (options.length - 1 === index) {
                  tmp = {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                  };
                }
                return (
                  <Button color={option.textColor || '#0977FF'}
                          containerStyle={[styles.button, tmp]}
                          key={index}
                          onPress={this.handlePress(option.onPress)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </ScrollView>
          </View>
          <Button containerStyle={[styles.content, styles.cancel]}
                  onPress={this.handleCancelPress}
          >
            <Text style={styles.cancelText}>
              {cancel || 'Cancel'}
            </Text>
          </Button>
        </AnimatableView>
      </Dialog>
    );
  }

}

class ActionSheet {
  /**
   * @param options
   * options (对象数组) - 一组按钮的选项（必选）{label: '按钮标题', onPress: ()=>console.log('press')}
   * cancelButtonIndex（整型） - 选项中取消按钮所在的位置（索引）
   * destructiveButtonIndex（整型） - 选项中删除按钮所在的位置（索引）
   * title（字符串） - 弹出框顶部的标题
   * message（字符串） - 弹出框顶部标题下方的信息
   * @param callback
   */
  static showActionSheetWithOptions(options: Object, callback: Function) {
    let actionSheet = new RootSiblings(<View />);
    actionSheet.update(
      <ActionSheetComponent {...options}
                            manager={actionSheet}
      />
    );

  }
}

export default ActionSheet;
