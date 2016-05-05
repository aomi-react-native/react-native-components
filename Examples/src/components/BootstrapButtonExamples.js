import React, {Component} from 'react';
import {
    ListView
} from 'react-native';

import Button from 'react-native-components/bootstrap/Button';

let buttons = [{
    children: 'Default'
}, {
    bsStyle: 'primary',
    children: 'Primary'
}, {
    bsStyle: 'success',
    children: 'Success'
}, {
    bsStyle: 'info',
    children: 'Info'
}, {
    bsStyle: 'warning',
    children: 'Warning'
}, {
    bsStyle: 'danger',
    children: 'Danger'
}, {
    disabled: true,
    children: 'Disabled'
}, {
    disabled: true,
    bsStyle: 'primary',
    children: 'Primary Disabled'
}, {
    beforeIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary'
}, {
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary'
}, {
    beforeIcon: 'plus',
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary'
}, {
    beforeIcon: 'plus',
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary',
    disabled: true
}, {
    children: 'Custom Style',
    color: '#FFF',
    fontSize: 12,
    style: {
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#10F2DD',
        backgroundColor: '#3C507B'
    }
}, {
    children: 'link',
    bsStyle: 'link'
}];
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let dataSource = ds.cloneWithRows(buttons);

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/4
 */
class BootstrapButtonExamples extends Component {

    renderRow(btn) {
        return (
            <Button {...btn}
                style={[{marginBottom: 10}, btn.style]}
            />
        );
    }

    render() {
        return (
            <ListView dataSource={dataSource}
                      renderRow={this.renderRow}
                      style={{flex: 1,padding: 15,flexDirection: 'column'}}
            />
        );
    }

}

export default BootstrapButtonExamples;
