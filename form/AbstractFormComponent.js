"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractComponent_1 = require("../AbstractComponent");
/**
 * Form 组件接口定义
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/8
 */
class AbstractFormComponent extends AbstractComponent_1.default {
    putFormValue(currentValue) {
        const { name, form, value } = this.props;
        name && form && form.putFormValue(name, currentValue || value);
    }
}
exports.default = AbstractFormComponent;
//# sourceMappingURL=AbstractFormComponent.js.map