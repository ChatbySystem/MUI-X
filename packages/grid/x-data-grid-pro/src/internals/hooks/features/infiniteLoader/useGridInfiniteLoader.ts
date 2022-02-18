import * as React from 'react';
import {
  GridEvents,
  GridEventListener,
  GridScrollParams,
  GridColumns,
  useGridApiEventHandler,
  useGridApiOptionHandler,
  visibleGridColumnsSelector,
  gridRowsMetaSelector,
  unstable_useCurrentPageRows as useCurrentPageRows,
} from '@mui/x-data-grid';
import { GridRowScrollEndParams } from '../../../models';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

/**
 * Only available in DataGridPro
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'scrollEndThreshold' | 'pagination' | 'paginationMode'
  >,
): void => {
  const currentPage = useCurrentPageRows(apiRef, props);

  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition: GridScrollParams) => {
      const dimensions = apiRef.current.getRootDimensions();
      if (!dimensions) {
        return;
      }

      const scrollPositionBottom = scrollPosition.top + dimensions.viewportOuterSize.height;
      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
      const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
      const contentHeight = Math.max(rowsMeta.currentPageTotalHeight, 1);

      if (scrollPositionBottom < contentHeight - props.scrollEndThreshold) {
        isInScrollBottomArea.current = false;
      }

      if (
        scrollPositionBottom >= contentHeight - props.scrollEndThreshold &&
        !isInScrollBottomArea.current
      ) {
        const visibleColumns = visibleGridColumnsSelector(apiRef);
        const rowScrollEndParam: GridRowScrollEndParams = {
          visibleColumns: visibleColumns as GridColumns<GridApiPro>,
          viewportPageSize,
          virtualRowsCount: currentPage.rows.length,
        };
        apiRef.current.publishEvent(GridEvents.rowsScrollEnd, rowScrollEndParam);
        isInScrollBottomArea.current = true;
      }
    },
    [props.scrollEndThreshold, apiRef, currentPage.rows.length],
  );

  const handleGridScroll = React.useCallback<GridEventListener<GridEvents.rowsScroll>>(
    ({ left, top }) => {
      handleRowsScrollEnd({ left, top });
    },
    [handleRowsScrollEnd],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleGridScroll);
  useGridApiOptionHandler(apiRef, GridEvents.rowsScrollEnd, props.onRowsScrollEnd);
};
