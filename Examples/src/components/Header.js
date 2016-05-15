/**
 * @author Sean sean.snow@live.com
 * @date 2015/12/14
 */

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text
} from 'react-native';

const height = 40;
const color = '#FFF';
let styles = {
    container: {
        flexDirection: 'row',
        backgroundColor: '#5E001B',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 25
    },
    cell: {
        flex: 1,
        height,
        justifyContent: 'center'
    },
    cellFixed: {
        width: 80,
        height,
        justifyContent: 'center'
    },
    title: {
        color,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700'
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    }
};

class Header extends Component {

    static propTypes = {
        backButton: PropTypes.bool,
        backOnPress: PropTypes.func,
        backgroundColor: PropTypes.string,
        left: PropTypes.node,
        right: PropTypes.node,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    };

    render() {

        let left = this.props.left;

        let title = null;
        if (typeof this.props.title === 'string') {
            title = (
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
            );
        } else {
            title = this.props.title;
        }

        return (
            <View style={styles.container}>
                <View style={styles.cellFixed}>
                    {left}
                </View>
                <View style={styles.cell}>
                    {title}
                </View>
                <View style={styles.cellFixed}>
                    {this.props.right}
                </View>
            </View>
        );
    }
}

export {Header as default, height};