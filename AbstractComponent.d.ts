/// <reference types="react" />
import { Component } from 'react';
/**
 * 1、实现自动绑定
 * 2、简易判断数据是否改动
 *
 * @author Sean sean.snow@live.com
 */
export default class AbstractComponent<P = {}, S = {}> extends Component<any, any> {
    constructor(props: P, content: S);
}
