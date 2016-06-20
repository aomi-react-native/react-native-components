import { Component } from 'react';

const excludeFunc = [
  'constructor',
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shounldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

/**
 * 1、实现自动绑定
 *
 * @author Sean sean.snow@live.com
 */
class Container extends Component {

  constructor(props) {
    super(props);
    // noinspection Eslint
    let propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    propertyNames.forEach(func => {
      if (excludeFunc.indexOf(func) === -1 && typeof this[func] === 'function') {
        this[func] = this[func].bind(this);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      return true;
    }

    if (this.state !== nextState) {
      return true;
    }
  }


}

export default Container;
