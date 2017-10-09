import React, { Component } from 'react';
import { View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/11
 */
export default function (RooView, props) {

  return class extends Component {

    static propTypes = RooView.prototype;

    manager;

    constructor(props) {
      super(props);
      this.manager = new RootSiblings(<View/>);
    }

    componentDidMount() {
      this.manager.update(
        <RooView {...props}
                 {...this.props}
                 manager={this.manager}
        />
      );
    }

    componentDidUpdate() {
      this.manager.update(
        <RooView {...props}
                 {...this.props}
                 manager={this.manager}
        />
      );
    }

    componentWillUnmount() {
      this.manager.destroy();
    }

    render() {
      return <View/>;
    }
  };
}
