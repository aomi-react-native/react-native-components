import { Component } from 'react';

const excludeFunc = [
  'constructor',
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];


/**
 * 1、实现自动绑定
 * 2、简易判断数据是否改动
 *
 * @author Sean sean.snow@live.com
 */
export default class AbstractComponent<P = {}, S = {}> extends Component<P, S> {

  constructor(props?: P, content?: any) {
    super(props, content);
    const propertyNames = Reflect.ownKeys(Reflect.getPrototypeOf(this));
    propertyNames.forEach((func: string) => {
      if (!excludeFunc.includes(func) && typeof this[func] === 'function') {
        this[func] = this[func].bind(this);
      }
    });
  }

}
