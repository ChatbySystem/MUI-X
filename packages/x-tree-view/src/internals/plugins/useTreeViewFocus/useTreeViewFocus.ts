import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';

const useTabbableItemId = (
  instance: TreeViewUsedInstance<UseTreeViewFocusSignature>,
  selectedItems: string | string[] | null,
) => {
  const isItemVisible = (itemId: string) => {
    const node = instance.getNode(itemId);
    return node && (node.parentId == null || instance.isItemExpanded(node.parentId));
  };

  let tabbableItemId: string | null | undefined;
  if (Array.isArray(selectedItems)) {
    tabbableItemId = selectedItems.find(isItemVisible);
  } else if (selectedItems != null && isItemVisible(selectedItems)) {
    tabbableItemId = selectedItems;
  }

  if (tabbableItemId == null) {
    tabbableItemId = instance.getNavigableChildrenIds(null)[0];
  }

  return tabbableItemId;
};

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  publicAPI,
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  const tabbableItemId = useTabbableItemId(instance, models.selectedItems.value);

  const setFocusedItemId = useEventCallback((itemId: React.SetStateAction<string | null>) => {
    const cleanItemId = typeof itemId === 'function' ? itemId(state.focusedItemId) : itemId;
    if (state.focusedItemId !== cleanItemId) {
      setState((prevState) => ({ ...prevState, focusedItemId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
    [rootRef],
  );

  const isItemFocused = React.useCallback(
    (itemId: string) => state.focusedItemId === itemId && isTreeViewFocused(),
    [state.focusedItemId, isTreeViewFocused],
  );

  const isItemVisible = (itemId: string) => {
    const node = instance.getNode(itemId);
    return node && (node.parentId == null || instance.isItemExpanded(node.parentId));
  };

  const innerFocusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    const node = instance.getNode(itemId);
    const itemElement = document.getElementById(
      instance.getTreeItemIdAttribute(itemId, node.idAttribute),
    );
    if (itemElement) {
      itemElement.focus();
    }

    setFocusedItemId(itemId);
    if (params.onItemFocus) {
      params.onItemFocus(event, itemId);
    }
  };

  const focusItem = useEventCallback((event: React.SyntheticEvent, itemId: string) => {
    // If we receive an itemId, and it is visible, the focus will be set to it
    if (isItemVisible(itemId)) {
      innerFocusItem(event, itemId);
    }
  });

  const focusDefaultItem = useEventCallback((event: React.SyntheticEvent | null) => {
    let itemToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedItems.value)) {
      itemToFocusId = models.selectedItems.value.find(isItemVisible);
    } else if (models.selectedItems.value != null && isItemVisible(models.selectedItems.value)) {
      itemToFocusId = models.selectedItems.value;
    }

    if (itemToFocusId == null) {
      itemToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    innerFocusItem(event, itemToFocusId);
  });

  const removeFocusedItem = useEventCallback(() => {
    if (state.focusedItemId == null) {
      return;
    }

    const node = instance.getNode(state.focusedItemId);
    if (node) {
      const itemElement = document.getElementById(
        instance.getTreeItemIdAttribute(state.focusedItemId, node.idAttribute),
      );
      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  const canItemBeTabbed = (itemId: string) => itemId === tabbableItemId;

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isItemFocused,
    canItemBeTabbed,
    focusItem,
    focusDefaultItem,
    removeFocusedItem,
  });

  populatePublicAPI<UseTreeViewFocusSignature>(publicAPI, {
    focusItem,
  });

  useInstanceEventHandler(instance, 'removeItem', ({ id }) => {
    if (state.focusedItemId === id) {
      instance.focusDefaultItem(null);
    }
  });

  const createHandleFocus =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onFocus?.(event);
      // if the event bubbled (which is React specific) we don't want to steal focus
      if (event.target === event.currentTarget) {
        instance.focusDefaultItem(event);
      }
    };

  const focusedItem = instance.getNode(state.focusedItemId!);
  const activeDescendant = focusedItem
    ? instance.getTreeItemIdAttribute(focusedItem.id, focusedItem.idAttribute)
    : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedItemId: null });

useTreeViewFocus.params = {
  onItemFocus: true,
};
