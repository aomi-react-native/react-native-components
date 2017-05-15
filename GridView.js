import React, { cloneElement, PropTypes } from 'react';
import { ListView, StyleSheet, View, ViewPropTypes } from 'react-native';
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
     * 自动设置宽度
     */
    autoWidth: PropTypes.bool,

    cellStyle: ViewPropTypes.style,
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

  constructor(props) {
    super(props);
    const {cols, cells, rowHasChanged} = this.props;
    const ds = new ListView.DataSource({rowHasChanged});
    const data = this.handleCellData(cells, cols);
    this.state = {
      dataSource: ds.cloneWithRows(data),
      maxRowId: data.length,
      cellHeight: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cells !== nextProps.cells || this.props.cols !== nextProps.cols) {
      const data = this.handleCellData(nextProps.cells, nextProps.cols);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        maxRowId: data.length
      });
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

  renderRow(rowData: Array, sectionID, rowID) {
    const {renderCell, horizontalSpacing, verticalSpacing, autoWidth} = this.props;
    let style = {
      marginHorizontal: horizontalSpacing / 2
    };
    if (autoWidth) {
      style.flex = 1;
    }

    let children = rowData.map((cell, key) => {
      if (cell.empty) {
        return cloneElement(<View />, {
          key,
          style
        });
      }
      return cloneElement(<View />, {
        key,
        style,
        children: renderCell({
          cell,
          sectionID,
          rowID,
          cellId: key
        })
      });
    });
    return (
      <View style={[styles.row, {marginVertical: verticalSpacing / 2}]}>
        {children}
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const {renderSeparator} = this.props;
    return renderSeparator && renderSeparator(sectionID, rowID, adjacentRowHighlighted, this.state.maxRowId - 1);
  }

  render() {
    const {style, verticalSpacing, horizontalSpacing, ...other} = this.props;

    return (
      <ListView {...other}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSeparator={this.renderSeparator}
                style={[{
                  marginHorizontal: -horizontalSpacing,
                  marginVertical: -verticalSpacing
                }, style]}
      />
    );

  }
}

export default GridView;

