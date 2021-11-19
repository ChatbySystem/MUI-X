import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridState } from '../../../models/gridState';
import { gridSortedRowEntriesSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows';

/**
 * @feature Filter
 */
export const gridFilterStateSelector = (state: GridState) => state.filter;

/**
 * @feature Filter
 */
export const gridFilterModelSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filterModel,
);

/**
 * @feature Filter
 */
export const gridVisibleRowsLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRowsLookup,
);

/**
 * @feature Filter
 */
export const gridFilteredDescendantCountLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filteredDescendantCountLookup,
);

/**
 * @feature Filter
 */
export const gridVisibleSortedRowEntriesSelector = createSelector(
  gridVisibleRowsLookupSelector,
  gridSortedRowEntriesSelector,
  (visibleRowsLookup, sortedRows) =>
    sortedRows.filter((row) => visibleRowsLookup[row.id] !== false),
);

/**
 * @feature Filter
 */
export const gridVisibleSortedRowIdsSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  (visibleSortedRowEntries) => visibleSortedRowEntries.map((row) => row.id),
);

/**
 * @feature Filter
 * @deprecated Use `gridVisibleSortedRowIdsSelector` instead
 */
export const gridVisibleRowsSelector = gridVisibleSortedRowIdsSelector;

/**
 * @feature Filter
 */
export const gridVisibleSortedTopLevelRowEntriesSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  gridRowTreeSelector,
  gridRowTreeDepthSelector,
  (visibleSortedRows, rowTree, rowTreeDepth) => {
    if (rowTreeDepth < 2) {
      return visibleSortedRows;
    }

    return visibleSortedRows.filter((row) => rowTree[row.id]?.depth === 0);
  },
);

/**
 * @feature Filter
 */
export const gridVisibleRowCountSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  (visibleSortedRows) => visibleSortedRows.length,
);

/**
 * @feature Filter
 */
export const gridVisibleTopLevelRowCountSelector = createSelector(
  gridVisibleSortedTopLevelRowEntriesSelector,
  (visibleSortedTopLevelRows) => visibleSortedTopLevelRows.length,
);

/**
 * @feature Filter
 */
export const gridFilterActiveItemsSelector = createSelector(
  gridFilterModelSelector,
  gridColumnLookupSelector,
  (filterModel, columnLookup) =>
    filterModel.items?.filter((item) => {
      if (!item.columnField) {
        return false;
      }
      const column = columnLookup[item.columnField];
      if (!column?.filterOperators || column?.filterOperators?.length === 0) {
        return false;
      }
      const filterOperator = column.filterOperators.find(
        (operator) => operator.value === item.operatorValue,
      );
      if (!filterOperator) {
        return false;
      }
      return (
        !filterOperator.InputComponent || (item.value != null && item.value?.toString() !== '')
      );
    }),
);

export type GridFilterActiveItemsLookup = { [columnField: string]: GridFilterItem[] };

/**
 * @feature Filter
 */
export const gridFilterActiveItemsLookupSelector = createSelector(
  gridFilterActiveItemsSelector,
  (activeFilters) => {
    const result: GridFilterActiveItemsLookup = activeFilters.reduce((res, filterItem) => {
      if (!res[filterItem.columnField!]) {
        res[filterItem.columnField!] = [filterItem];
      } else {
        res[filterItem.columnField!].push(filterItem);
      }
      return res;
    }, {} as GridFilterActiveItemsLookup);

    return result;
  },
);
