import * as React from 'react';
import {
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridLogicOperator,
  GridRowId,
  GridRowIdGetter,
  GridValidRowModel,
} from '../../../models';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import {
  getDefaultGridFilterModel,
  GridAggregatedFilterItemApplier,
  GridFilterItemResult,
  GridQuickFilterValueResult,
} from './gridFilterState';
import { buildWarning } from '../../../utils/warning';
import { gridFilterableColumnLookupSelector, gridColumnLookupSelector } from '../columns';

type GridFilterItemApplier =
  | {
      v7: false;
      fn: (rowId: GridRowId) => boolean;
      item: GridFilterItem;
    }
  | {
      v7: true;
      fn: (row: GridValidRowModel) => boolean;
      item: GridFilterItem;
    };

type GridFilterItemApplierNotAggregated = (
  row: GridValidRowModel,
  shouldApplyItem?: (field: string) => boolean,
) => GridFilterItemResult;

/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operator.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
export const cleanFilterItem = (
  item: GridFilterItem,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => {
  const cleanItem: GridFilterItem = { ...item };

  if (cleanItem.id == null) {
    cleanItem.id = Math.round(Math.random() * 1e5);
  }

  if (cleanItem.operator == null) {
    // Selects a default operator
    // We don't use `apiRef.current.getColumn` because it is not ready during state initialization
    const column = gridColumnLookupSelector(apiRef)[cleanItem.field];
    cleanItem.operator = column && column!.filterOperators![0].value!;
  }

  return cleanItem;
};

const filterModelDisableMultiColumnsFilteringWarning = buildWarning(
  [
    'MUI: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.',
    'If you are using the community version of the `DataGrid`, this prop is always `true`.',
  ],
  'error',
);

const filterModelMissingItemIdWarning = buildWarning(
  'MUI: The `id` field is required on `filterModel.items` when you use multiple filters.',
  'error',
);

const filterModelMissingItemOperatorWarning = buildWarning(
  'MUI: The `operator` field is required on `filterModel.items`, one or more of your filtering item has no `operator` provided.',
  'error',
);

export const sanitizeFilterModel = (
  model: GridFilterModel,
  disableMultipleColumnsFiltering: boolean,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => {
  const hasSeveralItems = model.items.length > 1;

  let items: GridFilterItem[];
  if (hasSeveralItems && disableMultipleColumnsFiltering) {
    filterModelDisableMultiColumnsFilteringWarning();

    items = [model.items[0]];
  } else {
    items = model.items;
  }

  const hasItemsWithoutIds = hasSeveralItems && items.some((item) => item.id == null);
  const hasItemWithoutOperator = items.some((item) => item.operator == null);

  if (hasItemsWithoutIds) {
    filterModelMissingItemIdWarning();
  }

  if (hasItemWithoutOperator) {
    filterModelMissingItemOperatorWarning();
  }

  if (hasItemWithoutOperator || hasItemsWithoutIds) {
    return {
      ...model,
      items: items.map((item) => cleanFilterItem(item, apiRef)),
    };
  }

  if (model.items !== items) {
    return {
      ...model,
      items,
    };
  }

  return model;
};

export const mergeStateWithFilterModel =
  (
    filterModel: GridFilterModel,
    disableMultipleColumnsFiltering: boolean,
    apiRef: React.MutableRefObject<GridApiCommunity>,
  ) =>
  (filteringState: GridStateCommunity['filter']): GridStateCommunity['filter'] => ({
    ...filteringState,
    filterModel: sanitizeFilterModel(filterModel, disableMultipleColumnsFiltering, apiRef),
  });

const getFilterCallbackFromItem = (
  filterItem: GridFilterItem,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridFilterItemApplier | null => {
  if (!filterItem.field || !filterItem.operator) {
    return null;
  }

  const column = apiRef.current.getColumn(filterItem.field);
  if (!column) {
    return null;
  }
  let parsedValue;

  if (column.valueParser) {
    const parser = column.valueParser;
    parsedValue = Array.isArray(filterItem.value)
      ? filterItem.value?.map((x) => parser(x))
      : parser(filterItem.value);
  } else {
    parsedValue = filterItem.value;
  }
  const newFilterItem: GridFilterItem = { ...filterItem, value: parsedValue };

  const filterOperators = column.filterOperators;
  if (!filterOperators?.length) {
    throw new Error(`MUI: No filter operators found for column '${column.field}'.`);
  }

  const filterOperator = filterOperators.find(
    (operator) => operator.value === newFilterItem.operator,
  )!;
  if (!filterOperator) {
    throw new Error(
      `MUI: No filter operator found for column '${column.field}' and operator value '${newFilterItem.operator}'.`,
    );
  }

  if (filterOperator.getApplyFilterFn.v7) {
    const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
    if (typeof applyFilterOnRow !== 'function') {
      return null;
    }
    return {
      v7: true,
      item: newFilterItem,
      fn: (row: GridValidRowModel) => {
        const value = apiRef.current.getRowValue(row, column);
        return applyFilterOnRow(value, row, column, apiRef);
      },
    };
  }

  const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
  if (typeof applyFilterOnRow !== 'function') {
    return null;
  }

  return {
    v7: false,
    item: newFilterItem,
    fn: (rowId: GridRowId) => {
      const params = apiRef.current.getCellParams(rowId, newFilterItem.field!);
      return applyFilterOnRow(params);
    },
  };
};

/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridRowIdGetter | undefined} getRowId The getter for row's id.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export const buildAggregatedFilterItemsApplier = (
  getRowId: GridRowIdGetter | undefined,
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridFilterItemApplierNotAggregated | null => {
  const { items } = filterModel;

  const appliers = items
    .map((item) => getFilterCallbackFromItem(item, apiRef))
    .filter((callback): callback is GridFilterItemApplier => !!callback);

  if (appliers.length === 0) {
    return null;
  }

  return (row, shouldApplyFilter) => {
    const resultPerItemId: GridFilterItemResult = {};

    for (let i = 0; i < appliers.length; i += 1) {
      const applier = appliers[i];
      if (!shouldApplyFilter || shouldApplyFilter(applier.item.field)) {
        resultPerItemId[applier.item.id!] = applier.v7
          ? applier.fn(row)
          : applier.fn(getRowId ? getRowId(row) : row.id);
      }
    }

    return resultPerItemId;
  };
};

/**
 * Generates a method to easily check if a row is matching the current quick filter.
 * @param {GridRowIdGetter | undefined} getRowId The getter for row's id.
 * @param {any[]} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export const buildAggregatedQuickFilterApplier = (
  getRowId: GridRowIdGetter | undefined,
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridFilterItemApplierNotAggregated | null => {
  const quickFilterValues = filterModel.quickFilterValues?.filter(Boolean) ?? [];
  if (quickFilterValues.length === 0) {
    return null;
  }

  const columnsByField = gridFilterableColumnLookupSelector(apiRef);

  const appliersPerField = [] as {
    column: GridColDef;
    appliers: {
      v7: boolean;
      fn: null | ((...args: any[]) => boolean);
    }[];
  }[];

  Object.values(columnsByField).forEach((column) => {
    const getApplyQuickFilterFn = column?.getApplyQuickFilterFn;

    if (getApplyQuickFilterFn?.v7) {
      appliersPerField.push({
        column,
        appliers: quickFilterValues.map((value) => ({
          v7: true,
          fn: getApplyQuickFilterFn(value, column, apiRef),
        })),
      });
    } else if (getApplyQuickFilterFn) {
      appliersPerField.push({
        column,
        appliers: quickFilterValues.map((value) => ({
          v7: false,
          fn: getApplyQuickFilterFn(value, column, apiRef),
        })),
      });
    }
  });

  return function isRowMatchingQuickFilter(row, shouldApplyFilter) {
    const result = {} as GridQuickFilterValueResult;
    const usedCellParams = {} as { [field: string]: GridCellParams };

    /* eslint-disable no-restricted-syntax, no-labels, no-continue */
    outer: for (let v = 0; v < quickFilterValues.length; v += 1) {
      const filterValue = quickFilterValues[v];

      for (let i = 0; i < appliersPerField.length; i += 1) {
        const { column, appliers } = appliersPerField[i];
        const { field } = column;

        if (shouldApplyFilter && !shouldApplyFilter(field)) {
          continue;
        }

        const applier = appliers[v];
        const value = apiRef.current.getRowValue(row, column);

        if (applier.fn === null) {
          continue;
        }

        if (applier.v7) {
          const isMatching = applier.fn(value, row, column, apiRef);
          if (isMatching) {
            result[filterValue] = true;
            continue outer;
          }
        } else {
          const cellParams =
            usedCellParams[field] ??
            apiRef.current.getCellParams(getRowId ? getRowId(row) : row.id, field);
          usedCellParams[field] = cellParams;

          const isMatching = applier.fn(cellParams);
          if (isMatching) {
            result[filterValue] = true;
            continue outer;
          }
        }
      }

      result[filterValue] = false;
    }
    /* eslint-enable no-restricted-syntax, no-labels, no-continue */

    return result;
  };
};

export const buildAggregatedFilterApplier = (
  getRowId: GridRowIdGetter | undefined,
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridAggregatedFilterItemApplier => {
  const isRowMatchingFilterItems = buildAggregatedFilterItemsApplier(getRowId, filterModel, apiRef);
  const isRowMatchingQuickFilter = buildAggregatedQuickFilterApplier(getRowId, filterModel, apiRef);

  return function isRowMatchingFilters(row, shouldApplyFilter, result) {
    result.passingFilterItems = isRowMatchingFilterItems?.(row, shouldApplyFilter) ?? null;
    result.passingQuickFilterValues = isRowMatchingQuickFilter?.(row, shouldApplyFilter) ?? null;
  };
};

export const passFilterLogic = (
  allFilterItemResults: (null | GridFilterItemResult)[],
  allQuickFilterResults: (null | GridQuickFilterValueResult)[],
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): boolean => {
  const cleanedFilterItems = filterModel.items.filter(
    (item) => getFilterCallbackFromItem(item, apiRef) !== null,
  );

  const cleanedAllFilterItemResults = allFilterItemResults.filter(
    (result): result is GridFilterItemResult => result != null,
  );

  const cleanedAllQuickFilterResults = allQuickFilterResults.filter(
    (result): result is GridQuickFilterValueResult => result != null,
  );

  // Defaultize operators
  const quickFilterLogicOperator =
    filterModel.quickFilterLogicOperator ?? getDefaultGridFilterModel().quickFilterLogicOperator;
  const logicOperator = filterModel.logicOperator ?? getDefaultGridFilterModel().logicOperator;

  // get result for filter items model
  if (cleanedAllFilterItemResults.length > 0) {
    // Return true if the item pass with one of the rows
    const filterItemPredicate = (item: GridFilterItem) => {
      return cleanedAllFilterItemResults.some((filterItemResult) => filterItemResult[item.id!]);
    };

    if (logicOperator === GridLogicOperator.And) {
      const passesAllFilters = cleanedFilterItems.every(filterItemPredicate);
      if (!passesAllFilters) {
        return false;
      }
    } else {
      const passesSomeFilters = cleanedFilterItems.some(filterItemPredicate);
      if (!passesSomeFilters) {
        return false;
      }
    }
  }

  // get result for quick filter model
  if (cleanedAllQuickFilterResults.length > 0 && filterModel.quickFilterValues != null) {
    // Return true if the item pass with one of the rows
    const quickFilterValuePredicate = (value: string) => {
      return cleanedAllQuickFilterResults.some(
        (quickFilterValueResult) => quickFilterValueResult[value],
      );
    };

    if (quickFilterLogicOperator === GridLogicOperator.And) {
      const passesAllQuickFilterValues =
        filterModel.quickFilterValues.every(quickFilterValuePredicate);
      if (!passesAllQuickFilterValues) {
        return false;
      }
    } else {
      const passesSomeQuickFilterValues =
        filterModel.quickFilterValues.some(quickFilterValuePredicate);
      if (!passesSomeQuickFilterValues) {
        return false;
      }
    }
  }

  return true;
};
