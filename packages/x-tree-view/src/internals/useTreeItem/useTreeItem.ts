import * as React from 'react';
import { EventHandlers, extractEventHandlers, SlotComponentProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import {
  UseTreeItemParameters,
  UseTreeItemReturnValue,
  UseTreeItemRootSlotOwnProps,
  UseTreeItemRootSlotProps,
  UseTreeItemContentSlotOwnProps,
  UseTreeItemContentSlotProps,
  UseTreeItemGroupSlotOwnProps,
  UseTreeItemGroupSlotProps,
  UseTreeItemStatus,
} from './useTreeItem.types';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../plugins/defaultPlugins';
import { MuiCancellableEvent } from '../models/MuiCancellableEvent';
import { TreeViewCollapseIcon, TreeViewExpandIcon } from '../../icons';
import { useTreeItemInteractions } from '../useTreeItemInteractions';

export const useTreeItem = (inParameters: UseTreeItemParameters): UseTreeItemReturnValue => {
  const {
    icons,
    runItemPlugins,
    selection: { multiSelect },
    disabledItemsFocusable,
    instance,
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const {
    props: parameters,
    ref,
    wrapItem,
  } = runItemPlugins({ props: inParameters, ref: inParameters.rootRef });

  const { id, nodeId, label, children } = parameters;

  // We transform the ref into a `React.RefCallback`
  const rootRef = useForkRef(ref);

  const status: UseTreeItemStatus = {
    expandable: Boolean(Array.isArray(children) ? children.length : children),
    expanded: instance.isNodeExpanded(nodeId),
    focused: instance.isNodeFocused(nodeId),
    selected: instance.isNodeSelected(nodeId),
    disabled: instance.isNodeDisabled(nodeId),
  };

  const interactions = useTreeItemInteractions(nodeId, status);
  const idAttribute = instance.getTreeItemId(nodeId, id);

  let ariaSelected;
  if (multiSelect) {
    ariaSelected = status.selected;
  } else if (status.selected) {
    /* single-selection trees unset aria-selected on un-selected items.
     *
     * If the tree does not support multiple selection, aria-selected
     * is set to true for the selected node and it is not present on any other node in the tree.
     * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
     */
    ariaSelected = true;
  }

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLLIElement> & MuiCancellableEvent) => {
      otherHandlers.onFocus?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      // DOM focus stays on the tree which manages focus with aria-activedescendant
      if (event.target === event.currentTarget) {
        instance.focusRoot();
      }

      const canBeFocused = !status.disabled || disabledItemsFocusable;
      if (!status.focused && canBeFocused && event.currentTarget === event.target) {
        instance.focusNode(event, nodeId);
      }
    };

  const createContentHandleClick =
    (otherHandlers: EventHandlers) =>
    (event: React.MouseEvent<HTMLDivElement> & MuiCancellableEvent) => {
      otherHandlers.onClick?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      interactions.handleExpansion(event);
      interactions.handleSelection(event);
    };

  const createContentHandleMouseDown =
    (otherHandlers: EventHandlers) =>
    (event: React.MouseEvent<HTMLDivElement> & MuiCancellableEvent) => {
      otherHandlers.onMouseDown?.(event);

      if (event.defaultMuiPrevented) {
        return;
      }

      interactions.preventSelection(event);
    };

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemRootSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const rootOwnProps: UseTreeItemRootSlotOwnProps = {
      role: 'treeitem',
      tabIndex: -1,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': status.disabled || undefined,
    };

    return {
      ...externalEventHandlers,
      ...rootOwnProps,
      ...externalProps,
      onFocus: createRootHandleFocus(externalEventHandlers),
    };
  };

  const getContentProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemContentSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const contentOwnProps: UseTreeItemContentSlotOwnProps = {};

    return {
      ...externalEventHandlers,
      ...contentOwnProps,
      ...externalProps,
      onClick: createContentHandleClick(externalEventHandlers),
      onMouseDown: createContentHandleMouseDown(externalEventHandlers),
    };
  };

  const getLabelProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemContentSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const contentOwnProps: UseTreeItemContentSlotOwnProps = {
      children: label,
    };

    return {
      ...externalEventHandlers,
      ...contentOwnProps,
      ...externalProps,
    };
  };

  const getGroupProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemGroupSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    const groupOwnProps: UseTreeItemGroupSlotOwnProps = {
      unmountOnExit: true,
      component: 'ul',
      role: 'group',
      in: status.expanded,
      children,
    };

    return {
      ...externalEventHandlers,
      ...groupOwnProps,
      ...externalProps,
    };
  };

  let fallbackIcon: React.ElementType | undefined;
  let fallbackIconProps: SlotComponentProps<'svg', {}, {}> | undefined;
  if (status.expandable) {
    if (status.expanded) {
      fallbackIcon = icons.slots.collapseIcon ?? TreeViewCollapseIcon;
      fallbackIconProps = icons.slotProps.collapseIcon;
    } else {
      fallbackIcon = icons.slots.expandIcon ?? TreeViewExpandIcon;
      fallbackIconProps = icons.slotProps.expandIcon;
    }
  } else {
    fallbackIcon = icons.slots.endIcon;
    fallbackIconProps = icons.slotProps.endIcon;
  }

  return {
    getRootProps,
    getContentProps,
    getGroupProps,
    getLabelProps,
    rootRef,
    wrapItem,
    status,
    fallbackIcon,
    fallbackIconProps,
  };
};
