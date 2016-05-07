import React, {
    Component
} from 'react';

import {
    ListView
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/7
 */
class AbstractComponent extends Component {

    constructor(props, dataSource:Array) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.dataSource = this.ds.cloneWithRows(dataSource);
    }

    ds = {};
    dataSource = {};

    renderRow() {
    }

    render() {
        return (
            <ListView dataSource={this.dataSource}
                      renderRow={this.renderRow}
                      style={{flex: 1,padding: 15,flexDirection: 'column'}}
            />
        );
    }

}

export default AbstractComponent;
