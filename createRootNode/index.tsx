import * as React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import StaticContainer from 'static-container';
import RootManager from './RootManager';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  offStream: {
    position: 'absolute'
  }
});

export const CREATE_EVENT = 'ROOT_ELEMENT_CREATE';

export const UPDATE_EVENT = 'ROOT_ELEMENT_UPDATE';

let emitter = (AppRegistry as any).rootSiblingsEmitter;

if (!(emitter instanceof EventEmitter)) {
  emitter = new EventEmitter();
  // inject modals into app entry component
  const originRegister = AppRegistry.registerComponent;

  AppRegistry.registerComponent = (appKey, getAppComponent) => {
    const siblings = new Map();
    const updates = new Set();

    return originRegister(appKey, () => {
      const OriginAppComponent = getAppComponent();

      return class extends React.Component {

        static displayName = `Root(${appKey})`;

        constructor(props) {
          super(props);
          this.update = this.update.bind(this);
          ['update', 'create'].forEach(f => this[f] = this[f].bind(this));
          emitter.addListener(CREATE_EVENT, this.create);
          emitter.addListener(UPDATE_EVENT, this.update);
        }

        componentWillUnmount() {
          emitter.removeListener(CREATE_EVENT, this.create);
          emitter.removeListener(UPDATE_EVENT, this.update);
          siblings.clear();
          updates.clear();
        }

        create({id, SiblingComponent, props, callback}) {
          if (siblings.has(id) && !SiblingComponent) {
            siblings.delete(id);
          } else if (SiblingComponent) {
            siblings.set(id, {
              SiblingComponent,
              props
            });
            updates.add(id);
          }
          this.forceUpdate(callback);
        }

        update({id, props, callback}) {
          if (siblings.has(id)) {
            const sibling = siblings.get(id);
            sibling.props = props;
            siblings.set(id, sibling);
          }
          updates.add(id);
          this.forceUpdate(callback);
        }

        render() {
          const elements = [];
          siblings.forEach(({SiblingComponent, props}, id) => {
            elements.push(
              <StaticContainer
                key={`root-sibling-${id}`}
                shouldUpdate={updates.has(id)}
              >
                <SiblingComponent {...props}/>
              </StaticContainer>
            );
          });
          updates.clear();

          return (
            <View style={styles.container}>
              <StaticContainer shouldUpdate={false}>
                <OriginAppComponent {...this.props} />
              </StaticContainer>
              {elements}
            </View>
          );
        }
      };
    });
  };

  (AppRegistry as any).rootSiblingsEmitter = emitter;
}

export function createRootView(RootView, props): RootManager {
  return new RootManager(RootView, props);
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/11
 */
export default function createRootNode<P, S>(RootView) {

  return class extends React.Component<P, S> {

    manager: RootManager;

    componentWillMount() {
      this.manager = new RootManager(RootView, this.props);
    }

    componentWillUpdate(nextProps) {
      this.manager.update(nextProps);
    }

    componentWillUnmount() {
      this.manager.destroy();
    }

    render() {
      return <View/>;
    }
  };
}
