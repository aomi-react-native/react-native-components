import React, { PropTypes } from 'react';
import {
  ListView,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import AbstractComponent from './AbstractComponent';


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
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
     * 自动设置高度为宽度
     */
    autoHeightEqWidth: PropTypes.bool,

    /**
     * 自动设置宽度
     */
    autoWidth: PropTypes.bool,

    /**
     * 列数
     */
    cols: PropTypes.number,

    cellStyle: View.propTypes.style,
    /**
     * grid cell 列表数组
     */
    cells: PropTypes.array.isRequired,

    enableEmptySections: PropTypes.bool,

    /**
     * 水平间距
     */
    horizontalSpacing: PropTypes.number,
    /**
     * 渲染Grid Cell
     */
    renderCell: PropTypes.func.isRequired,
    rowHasChanged: PropTypes.func,
    verticalSpacing: PropTypes.number
  };

  static defaultProps = {
    autoWidth: true,
    cols: 1,
    enableEmptySections: true,
    rowHasChanged: (r1, r2) => r1 !== r2
  };

  constructor(props) {
    super(props);
    let {autoWidth, autoHeightEqWidth, verticalSpacing, horizontalSpacing, cols, cells, rowHasChanged} = this.props;
    if (autoWidth) {
      const spacingWidth = verticalSpacing ? verticalSpacing * cols : 0;
      const rowWidth = (width - spacingWidth) / cols;
      this.rowStyle = {
        width: rowWidth,
        marginBottom: horizontalSpacing ? horizontalSpacing : 0,
        marginRight: verticalSpacing ? verticalSpacing : 0
      };
      if (autoHeightEqWidth) {
        //noinspection JSSuspiciousNameCombination
        this.rowStyle.height = rowWidth;
      }
    }
    const ds = new ListView.DataSource({rowHasChanged});

    this.state = {
      dataSource: ds.cloneWithRows(cells)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.cells)});
  }

  // refs
  listView;

  rowStyle;


  getCellSize() {
    return {
      width: this.rowStyle.width,
      height: this.rowStyle.height
    };
  }

  renderRow(rowData, sectionID:Number, rowID:Number) {
    let {renderCell, cellStyle} = this.props;
    return (
      <View style={[cellStyle, this.rowStyle]}>
        {renderCell(rowData, sectionID, rowID, this.getCellSize())}
      </View>
    );
  }

  render() {
    let {...other} = this.props;

    return (
      <ListView {...other}
        contentContainerStyle={styles.grid}
        dataSource={this.state.dataSource}
        ref={listView => this.listView = listView}
        renderRow={this.renderRow}
      />
    );

  }
}

export default GridView;

