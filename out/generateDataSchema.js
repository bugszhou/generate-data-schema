"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultValue = void 0;
const lodash_1 = require("lodash");
let defaultValue = {
    string: "",
    number: -1,
    boolean: false,
    object: Object.create(null),
    array: [],
};
function isBaseType(type) {
    return [
        "boolean",
        "number",
        "string",
        "undefined",
        "bigint",
        "symbol",
    ].includes(type);
}
function transform(data) {
    const dataType = typeof data;
    if (["boolean", "number", "string", "undefined", "bigint", "symbol"].includes(dataType)) {
        return;
    }
    if (dataType === "object" && Array.isArray(data)) {
        return transformArray(data)?.properties ?? Object.create(null);
    }
    return transformObject(data);
}
function template(type, from, elementType) {
    const tpl = {
        type,
        from,
        default: defaultValue[type],
        properties: Object.create(null),
        elementType,
    };
    if (isBaseType(type)) {
        delete tpl.properties;
    }
    return tpl;
}
function transformObject(data) {
    const keys = Object.keys(data);
    const temp = Object.create(null);
    keys.forEach((key) => {
        const val = data[key];
        const valType = typeof val;
        temp[(0, lodash_1.camelCase)(key)] = template(Array.isArray(val) ? "array" : valType, key, Array.isArray(val) ? "array" : valType);
        if (isBaseType(valType)) {
            return;
        }
        if (valType === "object" && Array.isArray(val)) {
            const tpl = transformArray(val);
            temp[(0, lodash_1.camelCase)(key)].properties = tpl.properties;
            temp[(0, lodash_1.camelCase)(key)].elementType = tpl.elementType;
            return;
        }
        temp[(0, lodash_1.camelCase)(key)].properties = transformObject(val);
        temp[(0, lodash_1.camelCase)(key)].elementType = "object";
    });
    return temp;
}
function transformArray(data) {
    const arr = data[0];
    const type = typeof arr;
    if (isBaseType(type)) {
        return {
            elementType: type,
            properties: Object.create(null),
        };
    }
    if (type === "object" && Array.isArray(arr)) {
        const tpl = template(Array.isArray(arr) ? "array" : type, "", Array.isArray(arr) ? "array" : type);
        tpl.properties = transformArray(arr);
        return {
            elementType: "array",
            properties: tpl,
        };
    }
    return {
        elementType: "object",
        properties: transformObject(arr),
    };
}
exports.default = transform;
function setDefaultValue(val) {
    if (!val) {
        return;
    }
    defaultValue = val;
}
exports.setDefaultValue = setDefaultValue;
//# sourceMappingURL=generateDataSchema.js.map