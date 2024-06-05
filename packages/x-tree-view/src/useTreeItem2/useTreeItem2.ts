import * as React from 'react';
import { EventHandlers, extractEventHandlers } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import {
  UseTreeItem2Parameters,
  UseTreeItem2ReturnValue,
  UseTreeItem2RootSlotProps,
  UseTreeItem2ContentSlotProps,
  UseTreeItem2GroupTransitionSlotProps,
  UseTreeItem2LabelSlotProps,
  UseTreeItemIconContainerSlotProps,
  UseTreeItem2CheckboxSlotProps,
  UseTreeItem2LabelInputSlotProps,
} from './useTreeItem2.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals/plugins/defaultPlugins';
import { MuiCancellableEvent } from '../internals/models/MuiCancellableEvent';
import { useTreeItem2Utils } from '../hooks/useTreeItem2Utils';
import { TreeViewItemDepthContext } from '../internals/TreeViewItemDepthContext';

const useTreeItemLabelInput = (inLabel: string) => {
  const [label, setLabel] = React.useState(inLabel);
  const [initialLabel, setInitialLabel] = React.useState(inLabel);

  const resetInitialLabel = (newLabel: string) => {
    setInitialLabel(newLabel);
    setLabel(newLabel);
  };

  const resetLabel = () => {
    setLabel(initialLabel);
  };

  React.useEffect(() => {
    resetInitialLabel(inLabel);
  }, [inLabel]);

  return {
    label,
    setLabel,
    resetLabel,
  };
};

export const useTreeItem2 = <TPlugins extends DefaultTreeViewPlugins = DefaultTreeViewPlugins>(
  parameters: UseTreeItem2Parameters,
): UseTreeItem2ReturnValue<TPlugins> => {
  const {
    runItemPlugins,
    selection: { multiSelect, disableSelection, checkboxSelection },
    disabledItemsFocusable,
    indentationAtItemLevel,
    instance,
    publicAPI,
  } = useTreeViewContext<TPlugins>();
  const depthContext = React.useContext(TreeViewItemDepthContext);

  const { id, itemId, label: inLabel, children, rootRef, isBeingEdited } = parameters;
  const { label, setLabel, resetLabel } = useTreeItemLabelInput(inLabel as string);

  const { rootRef: pluginRootRef, contentRef } = runItemPlugins(parameters);
  const { interactions, status } = useTreeItem2Utils({ itemId, children });
  const idAttribute = instance.getTreeItemIdAttribute(itemId, id);
  const handleRootRef = useForkRef(rootRef, pluginRootRef)!;
  const checkboxRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLButtonElement>(null);

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & MuiCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      const canBeFocused = !status.disabled || disabledItemsFocusable;
      if (!status.focused && canBeFocused && event.currentTarget === event.target) {
        instance.focusItem(event, itemId);
      }
    };

  const createRootHandleBlur =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLElement> & MuiCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      if (event.relatedTarget?.className === 'MuiTreeItem-labelInput') {
        return;
      }
      instance.removeFocusedItem();
    };

  const createRootHandleKeyDown =
    (otherHandlers: EventHandlers) =>
    (event: React.KeyboardEvent<HTMLElement> & MuiCancellableEvent) => {
      otherHandlers.onKeyDown?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      instance.handleItemKeyDown(event, itemId);
    };
  const createCotentHandleDoubleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & MuiCancellableEvent) => {
      otherHandlers.onDoubleClick?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }
      if (!checkboxSelection) {
        interactions.handleSelection(event);
      }
      instance.setEditedItemId(itemId);
    };

  const createContentHandleClick =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & MuiCancellableEvent) => {
      otherHandlers.onClick?.(event);
      if (event.defaultMuiPrevented || checkboxRef.current?.contains(event.target as HTMLElement)) {
        return;
      }

      interactions.handleExpansion(event);

      if (!checkboxSelection) {
        interactions.handleSelection(event);
      }
    };

  const createContentHandleMouseDown =
    (otherHandlers: EventHandlers) => (event: React.MouseEvent & MuiCancellableEvent) => {
      otherHandlers.onMouseDown?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      // Prevent text selection
      if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
        event.preventDefault();
      }
    };

  const createCheckboxHandleChange =
    (otherHandlers: EventHandlers) =>
    (event: React.ChangeEvent<HTMLInputElement> & MuiCancellableEvent) => {
      otherHandlers.onChange?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      if (disableSelection || status.disabled) {
        return;
      }

      interactions.handleCheckboxSelection(event);
    };

  const createInputHandleKeydown = (otherHandlers: EventHandlers) => (event: any) => {
    otherHandlers.onKeyDown?.(event);
    event.stopPropagation();
    if (event.key === 'Enter') {
      if (event.target?.value) {
        instance.updateItemLabel(itemId, event.target.value);
      } else {
        resetLabel();
      }
      instance.focusItem(event, itemId);
    } else if (event.key === 'Escape') {
      resetLabel();
      instance.focusItem(event, itemId);
    }
  };
  const createInputHandleBlur =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLInputElement> & MuiCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      resetLabel();
    };
  const createInputHandleChange =
    (otherHandlers: EventHandlers) =>
    (event: React.ChangeEvent<HTMLInputElement> & MuiCancellableEvent) => {
      otherHandlers.onChange?.(event);
      setLabel(event.target.value);
    };

  const getRootProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2RootSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    let ariaSelected: boolean | undefined;
    if (multiSelect) {
      ariaSelected = status.selected;
    } else if (status.selected) {
      /* single-selection trees unset aria-selected on un-selected items.
       *
       * If the tree does not support multiple selection, aria-selected
       * is set to true for the selected item and it is not present on any other item in the tree.
       * Source: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
       */
      ariaSelected = true;
    }

    const response: UseTreeItem2RootSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      ref: handleRootRef,
      role: 'treeitem',
      tabIndex: instance.canItemBeTabbed(itemId) && !instance.isItemBeingEdited(itemId) ? 0 : -1,
      id: idAttribute,
      'aria-expanded': status.expandable ? status.expanded : undefined,
      'aria-selected': ariaSelected,
      'aria-disabled': status.disabled || undefined,
      ...externalProps,
      onFocus: createRootHandleFocus(externalEventHandlers),
      onBlur: createRootHandleBlur(externalEventHandlers),
      onKeyDown: createRootHandleKeyDown(externalEventHandlers),
    };

    if (indentationAtItemLevel) {
      response.style = {
        '--TreeView-itemDepth':
          typeof depthContext === 'function' ? depthContext(itemId) : depthContext,
      } as React.CSSProperties;
    }

    return response;
  };

  const getContentProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2ContentSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const response: UseTreeItem2ContentSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      ...externalProps,
      ref: contentRef,
      onClick: createContentHandleClick(externalEventHandlers),
      onDoubleClick: createCotentHandleDoubleClick(externalEventHandlers),
      onMouseDown: createContentHandleMouseDown(externalEventHandlers),
      status,
    };

    if (indentationAtItemLevel) {
      response.indentationAtItemLevel = true;
    }

    return response;
  };

  const getCheckboxProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2CheckboxSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      visible: checkboxSelection,
      ref: checkboxRef,
      checked: status.selected,
      disabled: disableSelection || status.disabled,
      tabIndex: -1,
      ...externalProps,
      onChange: createCheckboxHandleChange(externalEventHandlers),
    };
  };

  const getLabelProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2LabelSlotProps<ExternalProps> => {
    const externalEventHandlers = {
      ...extractEventHandlers(parameters),
      ...extractEventHandlers(externalProps),
    };

    return {
      ...externalEventHandlers,
      children: label,
      ...externalProps,
    };
  };

  const getLabelInputProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2LabelInputSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      ...externalProps,
      ref: inputRef,
      visible: isBeingEdited,
      onKeyDown: createInputHandleKeydown(externalEventHandlers),
      onChange: createInputHandleChange(externalEventHandlers),
      onBlur: createInputHandleBlur(externalEventHandlers),
      value: label,
    };
  };

  const getIconContainerProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItemIconContainerSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    return {
      ...externalEventHandlers,
      ...externalProps,
    };
  };

  const getGroupTransitionProps = <ExternalProps extends Record<string, any> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ): UseTreeItem2GroupTransitionSlotProps<ExternalProps> => {
    const externalEventHandlers = extractEventHandlers(externalProps);

    const response: UseTreeItem2GroupTransitionSlotProps<ExternalProps> = {
      ...externalEventHandlers,
      unmountOnExit: true,
      component: 'ul',
      role: 'group',
      in: status.expanded,
      children,
      ...externalProps,
    };

    if (indentationAtItemLevel) {
      response.indentationAtItemLevel = true;
    }

    return response;
  };

  return {
    getRootProps,
    getContentProps,
    getGroupTransitionProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getLabelInputProps,
    rootRef: handleRootRef,
    status,
    publicAPI,
  };
};
