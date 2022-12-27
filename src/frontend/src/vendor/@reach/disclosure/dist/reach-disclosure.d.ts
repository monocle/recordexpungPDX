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

import * as React from 'react';
import * as Polymorphic from '@reach/polymorphic';

/**
 * Welcome to @reach/disclosure!
 *
 * A disclosure is a button that controls visibility of a panel of content. When
 * the content inside the panel is hidden, it is often styled as a typical push
 * button with a right-pointing arrow or triangle to hint that activating the
 * button will display additional content. When the content is visible, the
 * arrow or triangle typically points down.
 *
 * If you have a group of disclosures that stack vertically and exist within the
 * same logical context, you may want to use @reach/accordion instead.
 *
 * @see Docs     https://reach.tech/disclosure
 * @see Source   https://github.com/reach/reach-ui/tree/main/packages/disclosure
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#disclosure
 */

declare enum DisclosureStates {
    Open = "open",
    Collapsed = "collapsed"
}
/**
 * Disclosure
 *
 * The wrapper component and context provider for a disclosure's button and
 * panel components. A disclosure should only have one button and one panel
 * descendant.
 *
 * @see Docs https://reach.tech/disclosure#disclosure-1
 *
 * @param props
 */
declare const Disclosure: React.FC<DisclosureProps>;
interface DisclosureProps {
    /**
     * `Disclosure` expects to receive accept `DisclosureButton` and
     * `DisclosurePanel` components as children. It can also accept wrapper
     * elements if desired, though it is not recommended to pass other arbitrary
     * components within a disclosure in most cases.
     *
     * @see Docs https://reach.tech/disclosure#disclosure-children
     */
    children: React.ReactNode;
    /**
     * Whether or not an uncontrolled disclosure component should default to its
     * `open` state on the initial render.
     *
     * @see Docs https://reach.tech/disclosure#disclosure-defaultopen
     */
    defaultOpen?: boolean;
    /**
     * An id used to assign aria and id attributes to nested `DisclosureButton`
     * and `DisclosurePanel` components.
     *
     * Since the Disclosure component itself does not render a DOM element, an
     * `id` prop will not appear in the DOM directly as may be expected. Rather,
     * we need to generate IDs for the panel and button based on a disclosure ID
     * for aria compliance. If no `id` is passed we will generate descendant IDs
     * for you.
     *
     * @see Docs https://reach.tech/disclosure#disclosure-id
     */
    id?: React.ReactText;
    /**
     * The callback that is fired when a disclosure's open state is changed.
     *
     * @see Docs https://reach.tech/disclosure#disclosure-onchange
     */
    onChange?(): void;
    /**
     * The controlled open state of the disclosure. The `open` prop should be used
     * along with `onChange` to create controlled disclosure components.
     *
     * @see Docs https://reach.tech/disclosure#disclosure-open
     */
    open?: boolean;
}
/**
 * DisclosureButton
 *
 * The trigger button a user clicks to interact with a disclosure.
 *
 * @see Docs https://reach.tech/disclosure#disclosurebutton
 */
declare const DisclosureButton: Polymorphic.ForwardRefComponent<"button", DisclosureButtonProps>;
/**
 * @see Docs https://reach.tech/disclosure#disclosurebutton-props
 */
interface DisclosureButtonProps {
    /**
     * Typically a text string that serves as a label for the disclosure button,
     * though nested DOM nodes can be passed as well so long as they are valid
     * children of interactive elements.
     *
     * @see https://adrianroselli.com/2016/12/be-wary-of-nesting-roles.html
     * @see Docs https://reach.tech/disclosure#disclosurebutton-children
     */
    children: React.ReactNode;
}
/**
 * DisclosurePanel
 *
 * The collapsible panel in which inner content for an disclosure item is
 * rendered.
 *
 * @see Docs https://reach.tech/disclosure#disclosurepanel
 */
declare const DisclosurePanel: Polymorphic.ForwardRefComponent<"div", DisclosurePanelProps>;
/**
 * @see Docs https://reach.tech/disclosure#disclosurepanel-props
 */
interface DisclosurePanelProps {
    /**
     * Inner collapsible content for the disclosure item.
     *
     * @see Docs https://reach.tech/disclosure#disclosurepanel-children
     */
    children: React.ReactNode;
}
/**
 * A hook that exposes data for a given `Disclosure` component to its
 * descendants.
 *
 * @see Docs https://reach.tech/disclosure#usedisclosurecontext
 */
declare function useDisclosureContext(): {
    id: string | number;
    panelId: string;
    open: boolean;
};

export { Disclosure, DisclosureButton, DisclosureButtonProps, DisclosurePanel, DisclosurePanelProps, DisclosureProps, DisclosureStates, useDisclosureContext };
