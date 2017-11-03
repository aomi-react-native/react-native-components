"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AbstractComponent_1 = require("../AbstractComponent");
const react_native_1 = require("react-native");
/**
 * Form 表单组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Form extends AbstractComponent_1.default {
    constructor() {
        super(...arguments);
        /**
         * 错误字段
         * @type {Array}
         */
        this.errorFields = {};
        /**
         * 缺失字段
         * @type {Array}
         */
        this.missFields = {};
        /**
         * 表单数据
         * @type {{}}
         */
        this.formValue = {};
        this.formFields = {};
    }
    putFormValue(name, value) {
        this.formValue[name] = value;
    }
    putErrorField(name) {
        this.errorFields[name] = name;
    }
    putMissField(name) {
        this.missFields[name] = name;
    }
    /**
     * 删除表单错误字段
     * @param name 字段名字
     */
    deleteErrOrMissField(name) {
        this.errorFields[name] = null;
        this.missFields[name] = null;
    }
    /**
     * 获取表单数据
     * @returns {{}}
     */
    getFormValue() {
        return this.formValue;
    }
    /**
     * 获取表单错误字段信息
     * @returns {{miss: Array, error: Array}}
     */
    getErrorFields() {
        return {
            miss: Object.keys(this.missFields).filter(key => this.missFields[key] !== null),
            error: Object.keys(this.errorFields).filter(key => this.errorFields[key] !== null)
        };
    }
    /**
     * 校验表单是否正确
     * @returns {boolean}
     */
    isValid() {
        Object.keys(this.formFields).forEach(field => {
            this.formFields[field].valid && this.formFields[field].valid();
        });
        let miss = Object.keys(this.missFields).filter(key => this.missFields[key] !== null);
        let error = Object.keys(this.errorFields).filter(key => this.errorFields[key] !== null);
        return miss.length === 0 && error.length === 0;
    }
    render() {
        const _a = this.props, { renderChildren } = _a, other = __rest(_a, ["renderChildren"]);
        return (<react_native_1.View {...other}>
        {renderChildren && renderChildren(this)}
      </react_native_1.View>);
    }
}
exports.default = Form;
//# sourceMappingURL=index.js.map