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


// src/reach-disclosure.tsx
import * as React from "react";
import {
  createContext,
  makeId,
  useComposedRefs,
  composeEventHandlers,
  useControlledState
} from "@reach/utils";
import { useId } from "@reach/auto-id";
var [DisclosureProvider, useDisclosureCtx] = createContext("Disclosure");
var DisclosureStates = /* @__PURE__ */ ((DisclosureStates2) => {
  DisclosureStates2["Open"] = "open";
  DisclosureStates2["Collapsed"] = "collapsed";
  return DisclosureStates2;
})(DisclosureStates || {});
var Disclosure = ({
  children,
  defaultOpen = false,
  onChange,
  open: openProp,
  ...props
}) => {
  let id = useId(props.id ?? "disclosure");
  let panelId = makeId("panel", id);
  let [open, setOpen] = useControlledState({
    controlledValue: openProp,
    defaultValue: defaultOpen,
    calledFrom: "Disclosure"
  });
  function onSelect() {
    onChange?.();
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
var DisclosureButton = React.forwardRef(function DisclosureButton2({
  as: Comp = "button",
  children,
  onClick,
  onMouseDown,
  onPointerDown,
  ...props
}, forwardedRef) {
  const { onSelect, open, panelId } = useDisclosureCtx("DisclosureButton");
  const ownRef = React.useRef(null);
  const ref = useComposedRefs(forwardedRef, ownRef);
  function handleClick(event) {
    event.preventDefault();
    ownRef.current && ownRef.current.focus();
    onSelect();
  }
  return /* @__PURE__ */ React.createElement(Comp, {
    "aria-controls": panelId,
    "aria-expanded": open,
    ...props,
    "data-reach-disclosure-button": "",
    "data-state": open ? "open" /* Open */ : "collapsed" /* Collapsed */,
    ref,
    onClick: composeEventHandlers(onClick, handleClick)
  }, children);
});
DisclosureButton.displayName = "DisclosureButton";
var DisclosurePanel = React.forwardRef(function DisclosurePanel2({ as: Comp = "div", children, ...props }, forwardedRef) {
  const { panelId, open } = useDisclosureCtx("DisclosurePanel");
  return /* @__PURE__ */ React.createElement(Comp, {
    ref: forwardedRef,
    hidden: !open,
    ...props,
    "data-reach-disclosure-panel": "",
    "data-state": open ? "open" /* Open */ : "collapsed" /* Collapsed */,
    id: panelId
  }, children);
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
export {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  DisclosureStates,
  useDisclosureContext
};
