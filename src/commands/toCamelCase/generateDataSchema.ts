import { camelCase } from "lodash";

let defaultValue: any = {
  string: "",
  number: -1,
  boolean: false,
  object: Object.create(null),
  array: [],
};

function isBaseType(type: string) {
  return [
    "boolean",
    "number",
    "string",
    "undefined",
    "bigint",
    "symbol",
  ].includes(type);
}

function transform(data: any) {
  const dataType = typeof data;
  if (
    ["boolean", "number", "string", "undefined", "bigint", "symbol"].includes(
      dataType,
    )
  ) {
    return;
  }

  if (dataType === "object" && Array.isArray(data)) {
    return transformArray(data)?.properties ?? Object.create(null);
  }

  return transformObject(data);
}

function template(type: string, from: string, elementType: string) {
  const tpl = {
    type,
    from,
    default: defaultValue[type],
    properties: Object.create(null),
    elementType,
  };

  if (isBaseType(type) || isBaseType(elementType)) {
    delete tpl.properties;
  }

  return tpl;
}

function transformObject(data: Record<string, any>) {
  const keys = Object.keys(data);
  const temp: any = Object.create(null);
  keys.forEach((key) => {
    const val = data[key];
    const valType = typeof val;
    temp[camelCase(key)] = template(
      Array.isArray(val) ? "array" : valType,
      key,
      Array.isArray(val) ? "array" : valType,
    );
    if (isBaseType(valType)) {
      return;
    }

    if (valType === "object" && Array.isArray(val)) {
      const tpl = transformArray(val);
      temp[camelCase(key)].properties = tpl.properties;
      temp[camelCase(key)].elementType = tpl.elementType;
      if (isBaseType(tpl.elementType)) {
        delete temp[camelCase(key)].properties;
      }
      return;
    }
    temp[camelCase(key)].properties = transformObject(val);
    temp[camelCase(key)].elementType = "object";
  });

  return temp;
}

function transformArray(data: any[]) {
  const arr = data[0];
  const type = typeof arr;
  if (isBaseType(type)) {
    return {
      elementType: type,
    };
  }

  if (type === "object" && Array.isArray(arr)) {
    const tpl = template(
      Array.isArray(arr) ? "array" : type,
      "",
      Array.isArray(arr) ? "array" : type,
    );

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

export default transform;

export function setDefaultValue(val: any) {
  if (!val) {
    return;
  }
  defaultValue = val;
}
