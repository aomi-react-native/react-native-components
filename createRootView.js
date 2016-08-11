import React, { Component } from 'react';
import { View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/11
 */
export default function (RooView) {
  return class extends Component {

    componentDidMount() {
      this.manager = new RootSiblings(<RooView {...this.props}/>);
    }

    componentDidUpdate() {
      this.manager.update(<RooView {...this.props}/>);
    }

    componentWillUnmount() {
      this.manager.destroy();
    }

    render() {
      return <View />;
    }
  };
}
