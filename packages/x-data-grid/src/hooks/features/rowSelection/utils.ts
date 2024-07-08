import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridSignature } from '../../utils/useGridApiEventHandler';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '../../../models/gridRows';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

export function isMultipleRowSelectionEnabled(
  props: Pick<
    DataGridProcessedProps,
    'signature' | 'disableMultipleRowSelection' | 'checkboxSelection'
  >,
) {
  if (props.signature === GridSignature.DataGrid) {
    // DataGrid Community has multiple row selection enabled only if checkbox selection is enabled.
    return props.checkboxSelection && props.disableMultipleRowSelection !== true;
  }
  return !props.disableMultipleRowSelection;
}

const getRowNodeParents = (tree: GridRowTreeConfig, id: GridRowId) => {
  const parents: GridRowId[] = [];

  let parent: GridRowId | null = id;

  while (parent && parent !== GRID_ROOT_GROUP_ID) {
    const node = tree[parent] as GridGroupNode;
    if (!node) {
      return parents;
    }
    parents.push(parent);

    parent = node.parent;
  }
  return parents;
};

const getRowNodeSiblings = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  id: GridRowId,
) => {
  const node = apiRef.current.getRowNode(id);
  if (!node) {
    return [];
  }

  const parent = node.parent;
  if (!parent) {
    return [];
  }

  const parentNode = tree[parent] as GridGroupNode;

  return [...parentNode.children].filter((childId) => childId !== id);
};

export const findRowsToSelect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  selectedRow: GridRowId,
) => {
  const rowsToSelect: GridRowId[] = [];

  const traverseParents = (rowId: GridRowId) => {
    const siblings: GridRowId[] = getRowNodeSiblings(apiRef, tree, rowId);
    if (
      siblings.length === 0 ||
      siblings.every((sibling) => apiRef.current.isRowSelected(sibling))
    ) {
      const rowNode = apiRef.current.getRowNode(rowId) as GridGroupNode;
      const parent = rowNode.parent;
      if (parent && parent !== GRID_ROOT_GROUP_ID) {
        rowsToSelect.push(parent);
        traverseParents(parent);
      }
    }
  };
  traverseParents(selectedRow);

  const rowNode = apiRef.current.getRowNode(selectedRow);

  if (rowNode?.type === 'group') {
    rowsToSelect.push(...apiRef.current.getRowGroupChildren({ groupId: selectedRow }));
  }
  return rowsToSelect;
};

export const findRowsToDeselect = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  tree: GridRowTreeConfig,
  deselectedRow: GridRowId,
) => {
  let rowsToDeselect: GridRowId[] = [];

  const allParents = getRowNodeParents(tree, deselectedRow);
  allParents.forEach((parent) => {
    const isSelected = apiRef.current.isRowSelected(parent);
    if (isSelected) {
      rowsToDeselect.push(parent);
    }
  });

  const rowNode = apiRef.current.getRowNode(deselectedRow);
  if (rowNode?.type === 'group') {
    rowsToDeselect = [
      ...rowsToDeselect,
      ...apiRef.current.getRowGroupChildren({ groupId: deselectedRow }),
    ];
  }
  return rowsToDeselect;
};
