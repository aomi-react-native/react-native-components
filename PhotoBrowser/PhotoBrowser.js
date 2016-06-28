import React, { PropTypes } from 'react';
import Component from '../AbstractComponent';
import {
  View,
  StyleSheet,
  Image,
  CameraRoll
} from 'react-native';
import GridView from '../GridView';
import Dialog from '../Dialog';
import Button from '../bootstrap/Button';
import Icon from '../Icon';
import { View as AnimatableView } from 'react-native-animatable';
import FullScreen from './FullScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  gridView: {
    backgroundColor: '#FFF'
  },
  cell: {
    position: 'relative'
  },
  check: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'transparent'
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});

/**
 * 照片浏览器
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/12
 */
class PhotoBrowser extends Component {

  static propTypes = {
    headerHeight: PropTypes.number,
    initialListSize: PropTypes.number,
    mediaList: PropTypes.array,
    pageSize: PropTypes.number,
    renderHeader: PropTypes.func,
    singleSelected: PropTypes.bool,
    onEnterFullScreen: PropTypes.func
  };

  static defaultProps = {
    initialListSize: 50,
    pageSize: 30,
    headerHeight: 60,
    singleSelected: false
  };

  constructor(props) {
    super(props);
    if (!props.mediaList) {
      CameraRoll.getPhotos({
        first: props.initialListSize,
        assetType: 'Photos'
      }).then((photos)=> {
        let page = photos.edges.map(photo=> photo.node.image);
        this.setState({
          photoBrowserOpen: true,
          mediaList: page
        });
      });
    }
  }

  // 数据状态
  state = {
    // 是否正在选择图片
    inChoice: false,
    // 当前选择的图片
    selected: [],
    // 是否正在全屏浏览
    fullBrowser: false,
    // 全屏浏览开始第一张图片
    startIndex: 0,
    mediaList: []
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.mediaList !== this.props.mediaList) {
      this.clearSelected();
    }
  }

  // 上一次选择的图片
  prevSelected = [];

  /**
   * 进入选择模式
   */
  enterChoiceModel() {
    this.setState({inChoice: true});
  }

  /**
   * 退出选择模式
   */
  exitChoiceModel() {
    this.setState({inChoice: false});
  }

  /**
   * 获取选择的图片
   * @return {Array}
   */
  getSelected() {
    return this.state.selected;
  }

  clearSelected() {
    this.prevSelected = [];
    this.setState({selected: []});
  }

  /**
   * 进入全屏浏览
   * @param startIndex 浏览第一张图片下标
   */
  enterFullBrowser(startIndex) {
    this.setState({
      fullBrowser: true,
      startIndex: startIndex * 1
    });
    const {onEnterFullScreen} = this.props;
    onEnterFullScreen && onEnterFullScreen();
  }

  /**
   * 退出全屏浏览
   */
  exitFullBrowser() {
    this.setState({
      fullBrowser: false
    });
  }

  /**
   * 如果为浏览系统相册,则自动加载下一页
   */
  handleEndReached() {

  }

  /**
   * 用于选择图片时更新ListView
   * @param prevRow row
   * @param nextRow row
   * @return {boolean} 是否变动
   */
  rowHasChanged(prevRow, nextRow) {
    const {inChoice, selected} = this.state;
    if (inChoice) {
      if (this.prevSelected.indexOf(prevRow) > -1) {
        return selected.indexOf(nextRow) === -1;
      }
      return selected.indexOf(nextRow) > -1;
    }
    return prevRow !== nextRow;
  }

  /**
   * grid 元素点击,
   * 如果正在选择图片,则更新选择状态,反之进入全屏浏览模式
   * @param row 当前row
   * @param rowId id
   * @return {function()} 点击执行函数
   */
  cellPress(row, rowId = 0) {
    return () => {
      let {inChoice, selected} = this.state;
      this.prevSelected = selected.slice();
      if (inChoice) {
        if (selected.indexOf(row) > -1) {
          // 目标已经选择,再次点击,删除选择
          selected.splice(selected.indexOf(row), 1);
        } else {
          if (this.props.singleSelected) {
            // 单选初始化
            selected = [];
          }
          selected.push(row);
        }
        this.setState({selected});
      } else {
        // 进入全屏模式
        this.enterFullBrowser(rowId);
      }
    };
  }


  renderHeader() {
    return null;
  }

  renderCell(source, sectionID, rowID, size) {
    const {inChoice, selected} = this.state;
    return (
      <Button bsStyle="link"
              onPress={this.cellPress(source, rowID)}
              style={styles.cell}
      >
        <Image source={source}
               style={size}
        />
        {
          inChoice && selected.indexOf(source) > -1 ? (
            <Icon color="#0977FF"
                  name="dot-circle-o"
                  size={20}
                  style={styles.check}
            />
          ) : null
        }
      </Button>
    );
  }


  render() {
    const {
      renderHeader,
      ...other
    } = this.props;

    return (
      <View style={styles.container}>
        {renderHeader ? renderHeader() : this.renderHeader()}
        <GridView {...other}
          autoHeightEqWidth
          cells={this.state.mediaList}
          cols={4}
          horizontalSpacing={1}
          onEndReached={this.handleEndReached}
          renderCell={this.renderCell}
          rowHasChanged={this.rowHasChanged}
          style={styles.gridView}
          verticalSpacing={1}
        />
        <Dialog style={styles.fullScreen}
                visible={this.state.fullBrowser}
        >
          <AnimatableView animation={this.state.headerAnimation}
                          style={styles.header}
          >
            {renderHeader ? renderHeader() : this.renderHeader()}
          </AnimatableView>
          <FullScreen mediaList={this.state.mediaList}
                      onEndReached={this.handleEndReached}
                      startIndex={this.state.startIndex}
          />
        </Dialog>
      </View>
    );
  }

}

export default PhotoBrowser;
