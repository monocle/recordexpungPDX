"use strict";
/**
  * @reach/disclosure v0.18.0
  *
  * Copyright (c) 2018-2022, React Training LLC
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */

var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/reach-disclosure.tsx
var reach_disclosure_exports = {};
__export(reach_disclosure_exports, {
  Disclosure: () => Disclosure,
  DisclosureButton: () => DisclosureButton,
  DisclosurePanel: () => DisclosurePanel,
  DisclosureStates: () => DisclosureStates,
  useDisclosureContext: () => useDisclosureContext
});
module.exports = __toCommonJS(reach_disclosure_exports);
var React = __toESM(require("react"));
var import_utils = require("@reach/utils");
var import_auto_id = require("@reach/auto-id");
var [DisclosureProvider, useDisclosureCtx] = (0, import_utils.createContext)("Disclosure");
var DisclosureStates = /* @__PURE__ */ ((DisclosureStates2) => {
  DisclosureStates2["Open"] = "open";
  DisclosureStates2["Collapsed"] = "collapsed";
  return DisclosureStates2;
})(DisclosureStates || {});
var Disclosure = (_a) => {
  var _b = _a, {
    children,
    defaultOpen = false,
    onChange,
    open: openProp
  } = _b, props = __objRest(_b, [
    "children",
    "defaultOpen",
    "onChange",
    "open"
  ]);
  var _a2;
  let id = (0, import_auto_id.useId)((_a2 = props.id) != null ? _a2 : "disclosure");
  let panelId = (0, import_utils.makeId)("panel", id);
  let [open, setOpen] = (0, import_utils.useControlledState)({
    controlledValue: openProp,
    defaultValue: defaultOpen,
    calledFrom: "Disclosure"
  });
  function onSelect() {
    onChange == null ? void 0 : onChange();
    setOpen((open2) => !open2);
  }
  return /* @__PURE__ */ React.createElement(DisclosureProvider, {
    disclosureId: id,
    onSelect,
    open,
    panelId
  }, children);
};
Disclosure.displayName = "Disclosure";
var DisclosureButton = React.forwardRef(function DisclosureButton2(_a, forwardedRef) {
  var _b = _a, {
    as: Comp = "button",
    children,
    onClick,
    onMouseDown,
    onPointerDown
  } = _b, props = __objRest(_b, [
    "as",
    "children",
    "onClick",
    "onMouseDown",
    "onPointerDown"
  ]);
  const { onSelect, open, panelId } = useDisclosureCtx("DisclosureButton");
  const ownRef = React.useRef(null);
  const ref = (0, import_utils.useComposedRefs)(forwardedRef, ownRef);
  function handleClick(event) {
    event.preventDefault();
    ownRef.current && ownRef.current.focus();
    onSelect();
  }
  return /* @__PURE__ */ React.createElement(Comp, __spreadProps(__spreadValues({
    "aria-controls": panelId,
    "aria-expanded": open
  }, props), {
    "data-reach-disclosure-button": "",
    "data-state": open ? "open" /* Open */ : "collapsed" /* Collapsed */,
    ref,
    onClick: (0, import_utils.composeEventHandlers)(onClick, handleClick)
  }), children);
});
DisclosureButton.displayName = "DisclosureButton";
var DisclosurePanel = React.forwardRef(function DisclosurePanel2(_a, forwardedRef) {
  var _b = _a, { as: Comp = "div", children } = _b, props = __objRest(_b, ["as", "children"]);
  const { panelId, open } = useDisclosureCtx("DisclosurePanel");
  return /* @__PURE__ */ React.createElement(Comp, __spreadProps(__spreadValues({
    ref: forwardedRef,
    hidden: !open
  }, props), {
    "data-reach-disclosure-panel": "",
    "data-state": open ? "open" /* Open */ : "collapsed" /* Collapsed */,
    id: panelId
  }), children);
});
DisclosurePanel.displayName = "DisclosurePanel";
function useDisclosureContext() {
  let { open, panelId, disclosureId } = useDisclosureCtx("useDisclosureContext");
  return React.useMemo(() => ({
    id: disclosureId,
    panelId,
    open
  }), [disclosureId, open, panelId]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  DisclosureStates,
  useDisclosureContext
});
//# sourceMappingURL=reach-disclosure.cjs.dev.js.map