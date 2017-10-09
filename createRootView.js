import React, { Component } from 'react';
import { View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/11
 */
export default function (RooView, props) {

  const manager = new RootSiblings(<View/>);

  return class extends Component {

    static propTypes = RooView.prototype;

    componentDidMount() {
      manager.update(
        <RooView {...props}
                 {...this.props}
                 manager={manager}
        />
      );
    }

    componentDidUpdate() {
      manager.update(
        <RooView {...props}
                 {...this.props}
                 manager={manager}
        />
      );
    }

    componentWillUnmount() {
      manager.destroy();
    }

    render() {
      return <View/>;
    }
  };
}
