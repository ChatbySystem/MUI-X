import * as React from 'react';
import {
  GridFooterNode,
  GridGroupNode,
  GridRowId,
  GridRowIdGetter,
  GridRowModel,
  GridRowsLookup,
  GridRowTreeConfig,
  GridTreeNode,
} from '../../../models';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridRowsFullUpdate,
  GridRowsInternalCache,
  GridRowsPartialUpdates,
  GridRowsState,
} from './gridRowsInterfaces';

export const GRID_ROOT_GROUP_ID = `auto-generated-group-node-root`;

/**
 * A helper function to check if the id provided is valid.
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowModel]].
 * @param {string} detailErrorMessage A custom error message to display for invalid IDs
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage: string = 'A row was provided without id in the rows prop:',
) {
  if (id == null) {
    throw new Error(
      [
        'MUI: The data grid component requires all rows to have a unique `id` property.',
        'Alternatively, you can use the `getRowId` prop to specify a custom id for each row.',
        detailErrorMessage,
        JSON.stringify(row),
      ].join('\n'),
    );
  }
}

export const getRowIdFromRowModel = (
  rowModel: GridRowModel,
  getRowId?: GridRowIdGetter,
  detailErrorMessage?: string,
): GridRowId => {
  const id = getRowId ? getRowId(rowModel) : rowModel.id;
  checkGridRowIdIsValid(id, rowModel, detailErrorMessage);
  return id;
};

export const getEmptyRowPartialUpdate = (): GridRowsPartialUpdates => ({
  type: 'partial',
  actions: {
    insert: [],
    modify: [],
    delete: [],
  },
  idToActionLookup: {},
});

export const createRowsInternalCache = ({
  rows,
  getRowId,
  loading,
}: Pick<DataGridProcessedProps, 'rows' | 'getRowId' | 'loading'>): GridRowsInternalCache => {
  const updates: GridRowsFullUpdate = {
    type: 'full',
    rows: [],
  };

  const dataRowIdToModelLookup: GridRowsLookup = {};
  const dataRowIdToIdLookup: Record<string, GridRowId> = {};

  // TODO: Is it useful to init those elements ?
  for (let i = 0; i < rows.length; i += 1) {
    const model = rows[i];
    const id = getRowIdFromRowModel(model, getRowId);
    dataRowIdToModelLookup[id] = model;
    dataRowIdToIdLookup[id] = id;
    updates.rows.push(id);
  }

  return {
    rowsBeforePartialUpdates: rows,
    loadingPropBeforePartialUpdates: loading,
    updates,
    dataRowIdToIdLookup,
    dataRowIdToModelLookup,
    autoGeneratedRowIdToIdLookup: {},
  };
};

export const getRowsStateFromCache = ({
  apiRef,
  rowCountProp,
  loadingProp,
  previousTree,
  previousTreeDepth,
}: {
  apiRef: React.MutableRefObject<GridApiCommunity>;
  rowCountProp: number | undefined;
  loadingProp: boolean | undefined;
  previousTree: GridRowTreeConfig | null;
  previousTreeDepth: number | null;
}): GridRowsState => {
  const { rowsBeforePartialUpdates, ...cacheForGrouping } = apiRef.current.unstable_caches.rows;
  const rowCount = rowCountProp ?? 0;

  const groupingResponse = apiRef.current.unstable_applyStrategyProcessor('rowTreeCreation', {
    ...cacheForGrouping,
    previousTree,
    previousTreeDepth,
  });

  apiRef.current.unstable_caches.rows = {
    ...apiRef.current.unstable_caches.rows,
    autoGeneratedRowIdToIdLookup: groupingResponse.autoGeneratedRowIdToIdLookup,
    updates: getEmptyRowPartialUpdate(),
  };

  const processedGroupingResponse = apiRef.current.unstable_applyPipeProcessors(
    'hydrateRows',
    groupingResponse,
  );

  const datasetSize = groupingResponse.dataRowIds.length;
  const dataTopLevelRowCount = (groupingResponse.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children
    .length;

  return {
    ...processedGroupingResponse,
    groupingResponseBeforeRowHydration: groupingResponse,
    loading: loadingProp,
    totalRowCount: Math.max(rowCount, datasetSize),
    totalTopLevelRowCount: Math.max(rowCount, dataTopLevelRowCount),
    dataRowIdToIdLookup: cacheForGrouping.dataRowIdToIdLookup,
    dataRowIdToModelLookup: cacheForGrouping.dataRowIdToModelLookup,
  };
};

export const getTreeNodeDescendants = (
  tree: GridRowTreeConfig,
  parentId: GridRowId,
  skipAutoGeneratedRows: boolean,
) => {
  const node = tree[parentId];
  if (node.type !== 'group') {
    return [];
  }

  const validDescendants: GridRowId[] = [];
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    const childNode = tree[child];
    if (
      !skipAutoGeneratedRows ||
      childNode.type === 'leaf' ||
      (childNode.type === 'group' && !childNode.isAutoGenerated)
    ) {
      validDescendants.push(child);
    }
    validDescendants.push(...getTreeNodeDescendants(tree, childNode.id, skipAutoGeneratedRows));
  }

  return validDescendants;
};

// TODO: Use everywhere
export const isAutoGeneratedRow = (
  rowNode: GridTreeNode,
): rowNode is GridGroupNode | GridFooterNode =>
  rowNode.type === 'footer' || (rowNode.type === 'group' && rowNode.isAutoGenerated);
