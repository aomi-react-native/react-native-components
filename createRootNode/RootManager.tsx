import * as React from 'react';
import PropTypes from 'prop-types';
import { AppRegistry } from 'react-native';
import { CREATE_EVENT, UPDATE_EVENT } from './index';

let rootId = 0;

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default class RootManager {

  _id = null;
  props;
  component;
  emitter;

  constructor(ElementComponent, props) {
    this.emitter = (AppRegistry as any).rootSiblingsEmitter;
    Object.defineProperty(this, '_id', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: rootId++
    });
    this.component = ElementComponent;
    this.props = props;
    const manager = this;
    this.emitter.emit(CREATE_EVENT, {
      id: this._id,
      SiblingComponent: class SiblingComponent extends React.Component {

        static childContextTypes = {
          manager: PropTypes.object
        };

        getChildContext() {
          return {
            manager
          };
        }

        componentWillUnmount() {
          manager.destroy();
        }

        render() {
          return <ElementComponent {...this.props}/>;
        }
      },
      props
    });
  }

  update(props, callback?) {
    this.props = props;
    this.emitter.emit(UPDATE_EVENT, {
      id: this._id,
      props,
      callback
    });
  }

  destroy(callback?) {
    this.emitter.emit(CREATE_EVENT, {
      id: this._id,
      callback
    });
  }

}
