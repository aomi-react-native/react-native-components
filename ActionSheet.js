import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import Component from './AbstractComponent';
import Button from './bootstrap/Button';
import Dialog from './Dialog';

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
    justifyContent: 'center'
  },
  titleText: {
    color: '#8F8F91',
    textAlign: 'center'
  },
  button: {
    borderRadius: 0,
    height,
    borderTopColor: '#DADADA',
    borderTopWidth: 1,
    backgroundColor: '#FFF'
  },
  cancel: {
    marginTop: 10,
    height,
    justifyContent: 'center'
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
class ActionSheet extends Component {

  static propTypes = {
    open: PropTypes.bool,

    //（字符串数组） - 一组按钮的标题（必选）
    options: PropTypes.arrayOf(PropTypes.string),

    // （整型） - 选项中取消按钮所在的位置（索引）
    cancelButtonIndex: PropTypes.number,

    // （整型） - 选项中删除按钮所在的位置（索引）
    destructiveButtonIndex: PropTypes.number,

    // （字符串） - 弹出框顶部的标题
    title: PropTypes.string,

    cancel: PropTypes.string,
    cancelPress: PropTypes.func,

    // （字符串） - 弹出框顶部标题下方的信息
    message: PropTypes.string
  };

  static defaultProps = {
    open: false
  };

  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    };
  }

  state = {};

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({open: true});
    }
  }

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

  render() {

    let props = this.state.open ? this.contentShowAnimation : this.contentHideAnimation;

    const {
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
      title,
      cancel,
      cancelPress
    } = this.props;

    return (
      <Dialog hideAnimation={this.hideAnimation}
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
              <Text style={styles.titleText}>{title}</Text>
            </View>
            <ScrollView>
              {
                options.map((option, index)=> {
                  let tmp = null;
                  if (options.length - 1 === index) {
                    tmp = {
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5
                    };
                  }
                  return (
                    <Button color="#0977FF"
                            key={index}
                            style={[styles.button, tmp]}
                    >
                      {option}
                    </Button>
                  );
                })
              }
            </ScrollView>
          </View>
          <Button style={[styles.content, styles.cancel]}>
            <Text style={styles.cancelText}>
              {cancel}
            </Text>
          </Button>
        </AnimatableView>
      </Dialog>
    );
  }

}

export default ActionSheet;
