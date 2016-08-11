import React, {
  PropTypes,
  cloneElement
} from 'react';
import {
  ListView,
  View,
  StyleSheet
} from 'react-native';
import AbstractComponent from './AbstractComponent';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
});

/**
 * GridView
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class GridView extends AbstractComponent {
  static propTypes = {
    /**
     * grid cell 列表数组
     */
    cells: PropTypes.array.isRequired,

    /**
     * 渲染Grid Cell
     */
    renderCell: PropTypes.func.isRequired,

    /**
     * 自动设置高度为宽度
     */
    autoHeightEqWidth: PropTypes.bool,

    /**
     * 自动设置宽度
     */
    autoWidth: PropTypes.bool,

    cellStyle: View.propTypes.style,
    /**
     * 列数
     */
    cols: PropTypes.number,

    enableEmptySections: PropTypes.bool,

    /**
     * 水平间距
     */
    horizontalSpacing: PropTypes.number,

    rowHasChanged: PropTypes.func,

    verticalSpacing: PropTypes.number
  };

  static defaultProps = {
    autoWidth: true,
    cols: 1,
    enableEmptySections: true,
    rowHasChanged: (r1, r2) => r1 !== r2
  };

  props: Object;
  state = {};
  // refs
  listView;

  constructor(props) {
    super(props);
    let {cols, cells, rowHasChanged} = this.props;
    const ds = new ListView.DataSource({rowHasChanged});
    let data = this.handleCellData(cells, cols);
    this.state = {
      dataSource: ds.cloneWithRows(data),
      cellHeight: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cells !== nextProps.cells || this.props.cols !== nextProps.cols) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(this.handleCellData(nextProps.cells, nextProps.cols))});
    }
  }

  handleCellData(cells, cols) {
    let data = [];
    let size = Math.ceil(cells.length / cols);

    for (let i = 0; i < size; i++) {
      let group = [];
      for (let j = 0; j < cols; j++) {
        if (cells[i * cols + j]) {
          group.push(cells[i * cols + j]);
        } else {
          group.push({empty: true});
        }
      }
      data.push(group);
    }
    return data;
  }

  handleCellLayout(event) {
    const {
      layout: {
        width: cellHeight
      }
    } = event.nativeEvent;
    this.setState({cellHeight});
  }

  renderRow(rowData: Array, sectionID, rowID) {
    const {renderCell, horizontalSpacing, verticalSpacing, autoWidth, autoHeightEqWidth} = this.props;
    let style = {
      marginHorizontal: horizontalSpacing / 2
    };
    if (autoWidth) {
      style.flex = 1;
    }
    let onLayout = null;

    if (autoHeightEqWidth) {
      style.height = this.state.cellHeight;
      if (rowID === '0') {
        onLayout = this.handleCellLayout;
      }
    }

    let children = rowData.map((cell, key)=> {
      if (cell.empty) {
        return cloneElement(<View />, {
          key,
          style
        });
      }
      return cloneElement(<View />, {
        key,
        style,
        onLayout,
        children: renderCell({
          cell,
          sectionID,
          rowID,
          key: key,
          height: style.height
        })
      });
    });
    return (
      <View style={[styles.row, {marginVertical: verticalSpacing / 2}]}>
        {children}
      </View>
    );
  }

  render() {
    let {...other, style, verticalSpacing, horizontalSpacing} = this.props;

    return (
      <ListView {...other}
        dataSource={this.state.dataSource}
        ref={listView => this.listView = listView}
        renderRow={this.renderRow}
        style={[{marginHorizontal: -horizontalSpacing, marginVertical: -verticalSpacing}, style]}
      />
    );

  }
}

export default GridView;

