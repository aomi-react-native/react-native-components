"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
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
class AbstractComponent extends react_1.Component {
    constructor(props, content) {
        super(props, content);
        const propertyNames = Reflect.ownKeys(Reflect.getPrototypeOf(this));
        propertyNames.forEach((func) => {
            if (!excludeFunc.includes(func) && typeof this[func] === 'function') {
                this[func] = this[func].bind(this);
            }
        });
    }
}
exports.default = AbstractComponent;
//# sourceMappingURL=AbstractComponent.js.map