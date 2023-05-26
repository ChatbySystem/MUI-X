import * as React from 'react';
import { defaultMemoize } from 'reselect';
import {
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridLogicOperator,
  GridRowId,
  GridTreeNode,
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
import { gridColumnFieldsSelector, gridColumnLookupSelector } from '../columns';

type GridFilterItemApplier = {
  fn: (rowId: GridRowId) => boolean;
  item: GridFilterItem;
};

type GridFilterItemApplierNotAggregated = (
  rowId: GridRowId,
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


export const isFastFilterFn = <T extends Function>(fn: T) => {
  return (fn as any).isFastFilter === true;
}

export const wrapFastFilterFn = <T extends Function | null>(fn: T) => {
  if (fn) {
    (fn as any).isFastFilter = true;
  }
  return fn;
}

export const wrapFastFilterOperators =
  <T extends GridFilterOperator<any, any, any>[]>(operators: T) => {
    return operators.map(operator => ({
      ...operator,
      getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef<any, any, any>) =>
        wrapFastFilterFn(operator.getApplyFilterFn(filterItem, column))
    }))
  }

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

  const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
  if (typeof applyFilterOnRow !== 'function') {
    return null;
  }

  const isFastFilter = isFastFilterFn(applyFilterOnRow);

  const fn =
    isFastFilter ?
      (rowId: GridRowId) => {
        const value = apiRef.current.getCellValue(rowId, newFilterItem.field!);
        const params = { value } as GridCellParams<any, unknown, unknown, GridTreeNode>;
        return applyFilterOnRow(params);
      } :
      (rowId: GridRowId) => {
        const params = apiRef.current.getCellParams(rowId, newFilterItem.field!);
        return applyFilterOnRow(params);
      };

  return { fn, item: newFilterItem };
};

/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export const buildAggregatedFilterItemsApplier = (
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

  if (appliers.length === 1) {
    const applier = appliers[0];
    const applierFn = applier.fn;

    const fn = eval(`(rowId, shouldApplyFilter) => {
      if (shouldApplyFilter && !shouldApplyFilter(applier.item.field)) {
        return {};
      }
      // ${applierFn.name} <- Keep a ref, prevent the bundler from optimizing away
      return { '${applier.item.id!}': applierFn(rowId) };
    }`);

    return fn;
  }

  return (rowId, shouldApplyFilter) => {
    const resultPerItemId: GridFilterItemResult = {};

    for (const applier of appliers) {
      if (shouldApplyFilter && !shouldApplyFilter(applier.item.field))
        continue;
      resultPerItemId[applier.item.id!] = applier.fn(rowId);
    }

    return resultPerItemId;
  };
};

/**
 * Generates a method to easily check if a row is matching the current quick filter.
 * @param {any[]} values The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export const buildAggregatedQuickFilterApplier = (
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridFilterItemApplierNotAggregated | null => {
  const { quickFilterValues = [] } = filterModel;
  if (quickFilterValues.length === 0) {
    return null;
  }

  const columnsFields = gridColumnFieldsSelector(apiRef);

  const appliersPerField: {
    [field: string]: (null | ((params: GridCellParams) => boolean))[];
  } = {};
  columnsFields.forEach((field) => {
    const column = apiRef.current.getColumn(field);
    const getApplyQuickFilterFn = column?.getApplyQuickFilterFn;
    if (!getApplyQuickFilterFn) {
      return;
    }
    appliersPerField[field] = quickFilterValues.map((value) =>
      getApplyQuickFilterFn(value, column, apiRef),
    );
  });

  // If some value does not have an applier we ignore them
  const sanitizedQuickFilterValues = quickFilterValues.filter((value, index) =>
    Object.keys(appliersPerField).some((field) => appliersPerField[field][index] != null),
  );

  if (sanitizedQuickFilterValues.length === 0) {
    return null;
  }

  return (rowId, shouldApplyFilter) => {
    const usedCellParams: { [field: string]: GridCellParams } = {};
    const fieldsToFilter: string[] = [];

    Object.keys(appliersPerField).forEach((field) => {
      if (!shouldApplyFilter || shouldApplyFilter(field)) {
        usedCellParams[field] = apiRef.current.getCellParams(rowId, field);
        fieldsToFilter.push(field);
      }
    });

    const quickFilterValueResult: GridQuickFilterValueResult = {};
    sanitizedQuickFilterValues.forEach((value, index) => {
      const isPassing = fieldsToFilter.some((field) => {
        if (appliersPerField[field][index] == null) {
          return false;
        }
        return appliersPerField[field][index]?.(usedCellParams[field]);
      });
      quickFilterValueResult[value] = isPassing;
    });

    return quickFilterValueResult;
  };
};

export const buildAggregatedFilterApplier = (
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): GridAggregatedFilterItemApplier => {
  const isRowMatchingFilterItems = buildAggregatedFilterItemsApplier(filterModel, apiRef);
  const isRowMatchingQuickFilter = buildAggregatedQuickFilterApplier(filterModel, apiRef);

  return (rowId, shouldApplyFilter) => ({
    passingFilterItems:
      isRowMatchingFilterItems && isRowMatchingFilterItems(rowId, shouldApplyFilter),
    passingQuickFilterValues:
      isRowMatchingQuickFilter && isRowMatchingQuickFilter(rowId, shouldApplyFilter),
  });
};

const filterModelItems = defaultMemoize(
  (apiRef: React.MutableRefObject<GridApiCommunity>, items: GridFilterItem[]) =>
    items.filter((item) => getFilterCallbackFromItem(item, apiRef) !== null)
);

export const passFilterLogic = (
  allFilterItemResults: (null | GridFilterItemResult)[],
  allQuickFilterResults: (null | GridQuickFilterValueResult)[],
  filterModel: GridFilterModel,
  apiRef: React.MutableRefObject<GridApiCommunity>,
): boolean => {
  const cleanedFilterItems = filterModelItems(apiRef, filterModel.items);

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
