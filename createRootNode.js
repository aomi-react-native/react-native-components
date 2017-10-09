import React, { Component } from 'react';
import { View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

class AbstractRootView extends Component {

  componentWillUnmount() {
    this.props.manager.destroy();
  }

  render() {
    return this.props.children;
  }

}

export function createRootView(rootView) {
  const manager = new RootSiblings(<View/>);
  manager.update(
    <AbstractRootView children={rootView}
                      manager={manager}
    />
  );
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/11
 */
export default function (RootView, props) {

  const manager = new RootSiblings(<View/>);

  return class extends Component {

    componentDidMount() {
      manager.update(
        <RootView {...props}
                  {...this.props}
                  manager={manager}
        />
      );
    }

    componentDidUpdate() {
      manager.update(
        <RootView {...props}
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
