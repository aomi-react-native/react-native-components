import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import GridView from './GridView';
import Button from './bootstrap/Button';
import Icon from './Icon';

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
  }
});

/**
 * 照片浏览器
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/12
 */
class PhotoBrowser extends Component {

  static propTypes = {
    hideAnimation: PropTypes.object,
    renderHeader: PropTypes.func,
    mediaList: PropTypes.array,
    showAnimation: PropTypes.object,
    singleSelected: PropTypes.bool,
    title: PropTypes.string
  };

  static defaultProps = {
    hideAnimation: {
      animation: 'fadeIn'
    },
    showAnimation: {
      animation: 'fadeOut'
    },
    singleSelected: false,
    title: 'Photos'
  };

  constructor(props) {
    super(props);
    this.state = {
      inChoice: false,
      selected: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.state.open) {
      this.switchOpen();
    }
  }

  prevSelected = [];

  switchOpen() {
    this.setState({open: !this.state.open});
  }

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

  cellPress(row) {
    return () => {
      let {inChoice, selected} = this.state;
      this.prevSelected = selected;
      if (inChoice) {
        if (selected.indexOf(row) > -1) {
          selected.splice(selected.indexOf(row), 1);
        } else {
          if (this.props.singleSelected) {
            selected = [];
          }
          selected.push(row);
        }
        this.setState({selected});
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
              onPress={this.cellPress(source)}
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
      mediaList,
      renderHeader
    } = this.props;

    return (
      <View style={styles.container}>
        {renderHeader ? renderHeader() : this.renderHeader()}
        <GridView autoHeightEqWidth
                  cols={4}
                  cells={mediaList}
                  horizontalSpacing={1}
                  initialListSize={50}
                  pageSize={20}
                  renderCell={this.renderCell}
                  rowHasChanged={this.rowHasChanged}
                  style={styles.gridView}
                  verticalSpacing={1}
        />
      </View>
    );
  }

}

export default PhotoBrowser;
