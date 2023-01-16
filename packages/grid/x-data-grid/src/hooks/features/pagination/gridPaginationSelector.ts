import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import {
  gridVisibleSortedRowEntriesSelector,
  gridVisibleSortedRowIdsSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
  gridVisibleTopLevelRowCountSelector,
} from '../filter/gridFilterSelector';
import { gridRowMaximumTreeDepthSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
import { getPageCount } from './gridPaginationUtils';

/**
 * @category Pagination
 * @ignore - do not document.
 */
export const gridPaginationSelector = (state: GridStateCommunity) => state.pagination;

/**
 * Get the pagination model
 * @category Pagination
 */
export const gridPaginationModelSelector = createSelector(
  gridPaginationSelector,
  (pagination) => pagination.paginationModel,
);

/**
 * Get the index of the page to render if the pagination is enabled
 * @category Pagination
 */
export const gridPageSelector = createSelector(
  gridPaginationSelector,
  (pagination) => pagination.paginationModel.page,
);

/**
 * Get the maximum amount of rows to display on a single page if the pagination is enabled
 * @category Pagination
 */
export const gridPageSizeSelector = createSelector(
  gridPaginationSelector,
  (pagination) => pagination.paginationModel.pageSize,
);

/**
 * Get the amount of pages needed to display all the rows if the pagination is enabled
 * @category Pagination
 */
export const gridPageCountSelector = createSelector(
  gridPaginationSelector,
  gridVisibleTopLevelRowCountSelector,
  (pagination, visibleTopLevelRowCount) =>
    getPageCount(visibleTopLevelRowCount, pagination.paginationModel.pageSize),
);

/**
 * Get the index of the first and the last row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export const gridPaginationRowRangeSelector = createSelector(
  gridPaginationSelector,
  gridRowTreeSelector,
  gridRowMaximumTreeDepthSelector,
  gridVisibleSortedRowEntriesSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
  (pagination, rowTree, rowTreeDepth, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) => {
    const visibleTopLevelRowCount = visibleSortedTopLevelRowEntries.length;
    const topLevelFirstRowIndex = Math.min(
      pagination.paginationModel.pageSize * pagination.paginationModel.page,
      visibleTopLevelRowCount - 1,
    );
    const topLevelLastRowIndex = Math.min(
      topLevelFirstRowIndex + pagination.paginationModel.pageSize - 1,
      visibleTopLevelRowCount - 1,
    );

    // The range contains no element
    if (topLevelFirstRowIndex === -1 || topLevelLastRowIndex === -1) {
      return null;
    }

    // The tree is flat, there is no need to look for children
    if (rowTreeDepth < 2) {
      return { firstRowIndex: topLevelFirstRowIndex, lastRowIndex: topLevelLastRowIndex };
    }

    const topLevelFirstRow = visibleSortedTopLevelRowEntries[topLevelFirstRowIndex];
    const topLevelRowsInCurrentPageCount = topLevelLastRowIndex - topLevelFirstRowIndex + 1;
    const firstRowIndex = visibleSortedRowEntries.findIndex(
      (row) => row.id === topLevelFirstRow.id,
    );
    let lastRowIndex = firstRowIndex;
    let topLevelRowAdded = 0;

    while (
      lastRowIndex < visibleSortedRowEntries.length &&
      topLevelRowAdded <= topLevelRowsInCurrentPageCount
    ) {
      const row = visibleSortedRowEntries[lastRowIndex];
      const depth = rowTree[row.id].depth;

      if (topLevelRowAdded < topLevelRowsInCurrentPageCount || depth > 0) {
        lastRowIndex += 1;
      }

      if (depth === 0) {
        topLevelRowAdded += 1;
      }
    }

    return { firstRowIndex, lastRowIndex: lastRowIndex - 1 };
  },
);

/**
 * Get the id and the model of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export const gridPaginatedVisibleSortedGridRowEntriesSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  gridPaginationRowRangeSelector,
  (visibleSortedRowEntries, paginationRange) => {
    if (!paginationRange) {
      return [];
    }

    return visibleSortedRowEntries.slice(
      paginationRange.firstRowIndex,
      paginationRange.lastRowIndex + 1,
    );
  },
);

/**
 * Get the id of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector(
  gridVisibleSortedRowIdsSelector,
  gridPaginationRowRangeSelector,
  (visibleSortedRowIds, paginationRange) => {
    if (!paginationRange) {
      return [];
    }

    return visibleSortedRowIds.slice(
      paginationRange.firstRowIndex,
      paginationRange.lastRowIndex + 1,
    );
  },
);
