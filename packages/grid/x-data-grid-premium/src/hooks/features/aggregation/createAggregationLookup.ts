import * as React from 'react';
import {
  gridColumnLookupSelector,
  gridFilteredRowsLookupSelector,
  GridRowId,
  gridRowIdsSelector,
  gridRowTreeSelector,
} from '@mui/x-data-grid-pro';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridAggregationFunction,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRules,
} from './gridAggregationInterfaces';
import { getAggregationRules } from './gridAggregationUtils';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

const getAggregationCellValue = ({
  apiRef,
  groupId,
  field,
  aggregationFunction,
  aggregationRowsScope,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  groupId: GridRowId;
  field: string;
  aggregationFunction: GridAggregationFunction;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
}) => {
  const rowTree = gridRowTreeSelector(apiRef);
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

  let rowIds: GridRowId[];

  // TODO: Add custom root id
  if (groupId === '') {
    rowIds = gridRowIdsSelector(apiRef).filter((rowId) => !rowTree[rowId].isAutoGenerated);
  } else {
    rowIds = apiRef.current.getRowGroupChildren({ groupId });
  }

  const values: any[] = [];
  rowIds.forEach((rowId) => {
    if (aggregationRowsScope === 'filtered' && filteredRowsLookup[rowId] === false) {
      return;
    }

    // If the row is a group, we want to aggregate based on its children
    // For instance in the following tree, we want the aggregated values of A to be based on A.A, A.B.A and A.B.B but not A.B
    // A
    //   A.A
    //   A.B
    //     A.B.A
    //     A.B.B
    const rowNode = apiRef.current.getRowNode(rowId)!;
    if (rowNode.children?.length) {
      return;
    }

    if (typeof aggregationFunction.getCellValue === 'function') {
      const row = apiRef.current.getRow(rowId);
      values.push(aggregationFunction.getCellValue({ row }));
    } else {
      values.push(apiRef.current.getCellValue(rowId, field));
    }
  });

  return aggregationFunction.apply({ values });
};

const getGroupAggregatedValue = ({
  groupId,
  apiRef,
  aggregationRowsScope,
  aggregatedFields,
  aggregationRules,
  position,
}: {
  groupId: GridRowId;
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
  aggregatedFields: string[];
  aggregationRules: GridAggregationRules;
  position: GridAggregationPosition;
}) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};

  for (let j = 0; j < aggregatedFields.length; j += 1) {
    const aggregatedField = aggregatedFields[j];
    const columnAggregationRules = aggregationRules[aggregatedField];

    groupAggregationLookup[aggregatedField] = {
      position,
      value: getAggregationCellValue({
        apiRef,
        groupId,
        field: aggregatedField,
        aggregationFunction: columnAggregationRules.aggregationFunction,
        aggregationRowsScope,
      }),
    };
  }

  return groupAggregationLookup;
};

export const createAggregationLookup = ({
  apiRef,
  aggregationFunctions,
  aggregationRowsScope,
  getAggregationPosition,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationFunctions: Record<string, GridAggregationFunction>;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
  getAggregationPosition: DataGridPremiumProcessedProps['getAggregationPosition'];
}): GridAggregationLookup => {
  const aggregationRules = getAggregationRules({
    columnsLookup: gridColumnLookupSelector(apiRef),
    aggregationModel: gridAggregationModelSelector(apiRef),
    aggregationFunctions,
  });

  const aggregatedFields = Object.keys(aggregationRules);
  if (aggregatedFields.length === 0) {
    return {};
  }

  const aggregationLookup: GridAggregationLookup = {};
  const rowIds = gridRowIdsSelector(apiRef);
  const rowTree = gridRowTreeSelector(apiRef);

  for (let i = 0; i < rowIds.length; i += 1) {
    const rowId = rowIds[i];
    const node = rowTree[rowId];
    const hasChildren = node.children?.some(
      (childId) => (rowTree[childId].position ?? 'body') === 'body',
    );

    if (hasChildren) {
      const position = getAggregationPosition(node);
      if (position != null) {
        aggregationLookup[rowId] = getGroupAggregatedValue({
          groupId: rowId,
          apiRef,
          aggregatedFields,
          aggregationRowsScope,
          aggregationRules,
          position,
        });
      }
    }
  }

  // TODO: Add custom root id
  const position = getAggregationPosition(null);
  if (position != null) {
    aggregationLookup[''] = getGroupAggregatedValue({
      groupId: '',
      apiRef,
      aggregatedFields,
      aggregationRowsScope,
      aggregationRules,
      position,
    });
  }

  return aggregationLookup;
};
