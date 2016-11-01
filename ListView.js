import React, {
  PropTypes,
  cloneElement
} from 'react';
import Component from './AbstractComponent';
import {
  ListView as RNListView,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  loadNextContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/16
 */
class ListView extends Component {

  static propTypes = {
    ...RNListView.propTypes,

    /**
     * 是否自动加载下一页,默认为true
     */
    autoLoadNextPage: PropTypes.bool,

    /**
     * 自动渲染Separator
     */
    autoRenderSeparator: PropTypes.bool,

    /**
     * separator 高亮颜色
     */
    highlightColor: PropTypes.string,

    /**
     * 加载下一页root View样式
     */
    loadNextContainerStyle: View.propTypes.style,

    /**
     * 加载下一页的回调函数
     */
    loadNextPage: PropTypes.func,

    /**
     * 加载下一页提示标题
     */
    loadNextTitle: PropTypes.string,

    /**
     * 加载下一页提示标题样式
     */
    loadNextTitleStyle: View.propTypes.style,

    /**
     * 触摸组件TouchableHighlight属性
     */
    touchableHighlighProps: PropTypes.object,

    /**
     * 列表触摸事件处理
     */
    onRowPress: PropTypes.func
  };

  static defaultProps = {
    ...RNListView.defaultProps,
    autoLoadNextPage: true,
    autoRenderSeparator: true,
    loadNextTitle: '正在加载下一页...',
    separatorColor: '#dfdfdf'
  };

  state = {
    refreshing: false,
    loading: false
  };

  handleLoadNextPage() {
    const {loadNextPage} = this.props;
    if (loadNextPage) {
      this.setState({loading: true});
      const handle = ()=> {
        this.setState({loading: false});
      };

      Promise.all(loadNextPage).done(handle, handle);
    }
  }

  renderFooter() {

    if (!this.state.loading) {
      return null;
    }

    const {renderFooter, loadNextContainerStyle, loadNextTitle, loadNextTitleStyle} = this.props;
    if (renderFooter) {
      return renderFooter();
    }

    return (
      <View style={[styles.loadNextContainer, loadNextContainerStyle]}>
        <ActivityIndicator />
        <Text style={[{marginHorizontal: 5}, loadNextTitleStyle]}>{loadNextTitle}</Text>
      </View>
    );
  }

  renderSeparator(sectionID: Number, rowID: Number, adjacentRowHighlighted: Boolean) {
    const {renderSeparator, separatorColor, highlightColor} = this.props;
    if (renderSeparator) {
      return renderSeparator(sectionID, rowID, adjacentRowHighlighted);
    }
    let style = {
      height: 0.5,
      backgroundColor: adjacentRowHighlighted ? highlightColor : separatorColor
    };
    return (
      <View key={`${sectionID}-${rowID}`}
            style={style}
      />
    );
  }

  renderRow(data: String, sectionID: Number, rowID: Number, highlightRow) {
    const {autoRenderSeparator, touchableHighlighProps, onRowPress, renderRow} = this.props;
    if (autoRenderSeparator) {
      let props = Object.assign({
        onPress: () => onRowPress && onRowPress(data, sectionID, rowID, highlightRow),
        onPressIn: () => highlightRow(sectionID, rowID),
        onPressOut: () => highlightRow(null),
      }, touchableHighlighProps);
      return cloneElement(<TouchableHighlight />, {
        ...props,
        children: renderRow ? renderRow(data, sectionID, rowID, highlightRow) : null
      });
    }
    return renderRow ? renderRow(data, sectionID, rowID, highlightRow) : null;
  }

  render() {
    return (
      <RNListView {...this.props}
        onEndReached={this.handleLoadNextPage}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
      />
    );
  }

}

ListView.DataSource = RNListView.DataSource;

export default ListView;
