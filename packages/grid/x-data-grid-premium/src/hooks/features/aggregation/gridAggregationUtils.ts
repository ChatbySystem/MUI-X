import * as React from 'react';
import {
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GRID_TREE_DATA_GROUPING_FIELD,
  GridColDef,
  gridRowGroupingModelSelector,
  GridRowId,
  GridRowTreeConfig,
  GridRowTreeNodeConfig,
} from '@mui/x-data-grid-pro';
import {
  GridColumnRawLookup,
  GridRowTreeCreationValue,
  isDeepEqual,
} from '@mui/x-data-grid-pro/internals';
import {
  GridAggregationFunction,
  GridAggregationModel,
  GridAggregationItem,
  GridAggregationRule,
  GridAggregationRules,
  GridColumnAggregationRules,
} from './gridAggregationInterfaces';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { getRowGroupingFieldFromGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';

export const getNonAutoGeneratedDescendants = (tree: GridRowTreeConfig, parentId: GridRowId) => {
  const children = tree[parentId].children;
  if (children == null) {
    return [];
  }

  const validDescendants: GridRowId[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const childNode = tree[child];
    if (!childNode.isAutoGenerated) {
      validDescendants.push(child);
    }
    validDescendants.push(...getNonAutoGeneratedDescendants(tree, childNode.id));
  }

  return validDescendants;
};

export const canColumnHaveAggregationFunction = ({
  column,
  aggregationFunctionName,
  aggregationFunction,
}: {
  column: GridColDef | undefined;
  aggregationFunctionName: string;
  aggregationFunction: GridAggregationFunction | undefined;
}): boolean => {
  if (!column || !column.aggregable) {
    return false;
  }

  if (!aggregationFunction) {
    return false;
  }

  if (column.availableAggregationFunctions != null) {
    return column.availableAggregationFunctions.includes(aggregationFunctionName);
  }

  if (!aggregationFunction.types) {
    return true;
  }

  return aggregationFunction.types.includes(column.type!);
};

export const getAvailableAggregationFunctions = ({
  aggregationFunctions,
  column,
}: {
  aggregationFunctions: Record<string, GridAggregationFunction>;
  column: GridColDef;
}) =>
  Object.keys(aggregationFunctions).filter((aggregationFunctionName) =>
    canColumnHaveAggregationFunction({
      column,
      aggregationFunctionName,
      aggregationFunction: aggregationFunctions[aggregationFunctionName],
    }),
  );

export const mergeStateWithAggregationModel =
  (aggregationModel: GridAggregationModel) =>
  (state: GridStatePremium): GridStatePremium => ({
    ...state,
    aggregation: { ...state.aggregation, model: aggregationModel },
  });

export const getColumnAggregationRules = ({
  columnItem,
  column,
  aggregationFunctions,
}: {
  columnItem: GridAggregationItem | undefined;
  column: GridColDef | undefined;
  aggregationFunctions: Record<string, GridAggregationFunction>;
}) => {
  const columnAggregationRules: GridColumnAggregationRules = {};

  let cleanColumnItem: { footer?: string | null; inline?: string | null };
  if (!columnItem) {
    cleanColumnItem = {};
  } else if (typeof columnItem === 'string') {
    cleanColumnItem = { footer: columnItem };
  } else {
    cleanColumnItem = columnItem;
  }

  if (
    cleanColumnItem.inline &&
    canColumnHaveAggregationFunction({
      column,
      aggregationFunctionName: cleanColumnItem.inline,
      aggregationFunction: aggregationFunctions[cleanColumnItem.inline],
    })
  ) {
    columnAggregationRules.inline = {
      aggregationFunctionName: cleanColumnItem.inline!,
      aggregationFunction: aggregationFunctions[cleanColumnItem.inline],
    };
  }

  if (
    cleanColumnItem.footer &&
    canColumnHaveAggregationFunction({
      column,
      aggregationFunctionName: cleanColumnItem.footer,
      aggregationFunction: aggregationFunctions[cleanColumnItem.footer],
    })
  ) {
    columnAggregationRules.footer = {
      aggregationFunctionName: cleanColumnItem.footer!,
      aggregationFunction: aggregationFunctions[cleanColumnItem.footer],
    };
  }

  return columnAggregationRules;
};

export const getAggregationRules = ({
  columnsLookup,
  aggregationModel,
  aggregationFunctions,
}: {
  columnsLookup: GridColumnRawLookup;
  aggregationModel: GridAggregationModel;
  aggregationFunctions: Record<string, GridAggregationFunction>;
}) => {
  const aggregationRules: GridAggregationRules = {};

  Object.entries(aggregationModel).forEach(([field, columnItem]) => {
    if (columnsLookup[field]) {
      aggregationRules[field] = getColumnAggregationRules({
        columnItem,
        column: columnsLookup[field],
        aggregationFunctions,
      });
    }
  });

  return aggregationRules;
};

/**
 * Add a footer for each group that has at least one column with an aggregated value.
 */
export const addFooterRows = ({
  groupingParams,
  aggregationRules,
  isGroupAggregated,
}: {
  groupingParams: GridRowTreeCreationValue;
  aggregationRules: GridAggregationRules;
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
}) => {
  if (Object.keys(aggregationRules).length === 0) {
    return groupingParams;
  }

  const ids = [...groupingParams.ids];
  const idRowsLookup = { ...groupingParams.idRowsLookup };
  const tree = { ...groupingParams.tree };

  const addGroupFooter = (parentNode: GridRowTreeNodeConfig | null) => {
    const parentId = parentNode?.id ?? null;

    if (isGroupAggregated && !isGroupAggregated(parentNode, 'footer')) {
      return;
    }

    const footerId =
      parentId == null
        ? `auto-generated-group-footer-root`
        : `auto-generated-group-footer-${parentId}`;

    ids.push(footerId);
    idRowsLookup[footerId] = {};
    tree[footerId] = {
      id: footerId,
      isAutoGenerated: true,
      parent: parentId,
      depth: parentNode ? parentNode.depth + 1 : 0,
      groupingKey: null,
      groupingField: null,
      position: 'footer',
    };

    if (parentId != null) {
      tree[parentId] = {
        ...tree[parentId],
        children: [...(tree[parentId].children ?? []), footerId],
      };
    }
  };

  addGroupFooter(null);

  // If the tree is flat, we don't need to loop through the rows
  if (groupingParams.treeDepth > 1) {
    groupingParams.ids.forEach((parentId) => {
      const parentNode = tree[parentId];
      if (parentNode.depth === groupingParams.treeDepth - 1) {
        return;
      }

      addGroupFooter(parentNode);
    });
  }

  return {
    ...groupingParams,
    ids,
    idRowsLookup,
    tree,
  };
};

/**
 * Compares two sets of aggregation rules to determine if they are equal or not.
 */
export const hasAggregationRulesChanged = (
  previousValue: GridAggregationRules | undefined,
  newValue: GridAggregationRules,
) => {
  const previousFields = Object.keys(previousValue ?? {});
  const newFields = Object.keys(newValue);

  if (!isDeepEqual(previousFields, newFields)) {
    return true;
  }

  const hasAggregationRuleChanged = (
    previousRule: GridAggregationRule | undefined,
    newRule: GridAggregationRule | undefined,
  ) => {
    if (previousRule?.aggregationFunction !== newRule?.aggregationFunction) {
      return true;
    }

    if (previousRule?.aggregationFunctionName !== newRule?.aggregationFunctionName) {
      return true;
    }

    return false;
  };

  return newFields.some((field) => {
    const previousColumnAggregationRules = previousValue?.[field];
    const newColumnAggregationRules = newValue[field];

    return (
      hasAggregationRuleChanged(
        previousColumnAggregationRules?.inline,
        newColumnAggregationRules.inline,
      ) ||
      hasAggregationRuleChanged(
        previousColumnAggregationRules?.footer,
        newColumnAggregationRules.footer,
      )
    );
  });
};

export const getGroupingColumns = ({
  apiRef,
  columnsLookup,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  columnsLookup: GridColumnRawLookup;
}): {
  groupingCriteria?: string[];
  groupingColumnField: string;
}[] => {
  if (columnsLookup[GRID_TREE_DATA_GROUPING_FIELD]) {
    return [{ groupingColumnField: GRID_TREE_DATA_GROUPING_FIELD }];
  }

  const rowGroupingModel = gridRowGroupingModelSelector(apiRef).filter(
    (field) => !!columnsLookup[field] && columnsLookup[field].groupable,
  );

  if (columnsLookup[GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD]) {
    return [
      {
        groupingColumnField: getRowGroupingFieldFromGroupingCriteria(null),
      },
    ];
  }

  return rowGroupingModel.map((groupingCriterion) => ({
    groupingCriteria: [groupingCriterion],
    groupingColumnField: getRowGroupingFieldFromGroupingCriteria(groupingCriterion),
  }));
};
