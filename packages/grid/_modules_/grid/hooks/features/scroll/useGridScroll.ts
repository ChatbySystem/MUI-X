import * as React from 'react';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useLogger } from '../../utils/useLogger';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { GridComponentProps } from '../../../GridComponentProps';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridScrollApi } from '../../../models/api/gridScrollApi';
import { scrollStateSelector } from '../virtualization/renderingStateSelector';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useNativeEventListener } from '../../root/useNativeEventListener';

// Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
// Similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
function scrollIntoView(dimensions) {
  const { clientHeight, scrollTop, offsetHeight, offsetTop } = dimensions;

  const elementBottom = offsetTop + offsetHeight;
  if (elementBottom - clientHeight > scrollTop) {
    return elementBottom - clientHeight;
  }
  if (offsetTop < scrollTop) {
    return offsetTop;
  }
  return undefined;
}

export const useGridScroll = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination'>,
): void => {
  const logger = useLogger('useGridScroll');
  const colRef = apiRef.current.columnHeadersElementRef!;
  const windowRef = apiRef.current.windowRef!;

  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);

  const scrollToIndexes = React.useCallback<GridScrollApi['scrollToIndexes']>(
    (params: Partial<GridCellIndexCoordinates>) => {
      if (totalRowCount === 0 || visibleColumns.length === 0) {
        return false;
      }

      logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);

      const scrollCoordinates: any = {};

      if (params.colIndex != null) {
        scrollCoordinates.left = scrollIntoView({
          clientHeight: windowRef.current!.clientWidth,
          scrollTop: windowRef.current!.scrollLeft,
          offsetHeight: visibleColumns[params.colIndex].computedWidth,
          offsetTop: columnsMeta.positions[params.colIndex],
        });
      }

      if (params.rowIndex != null) {
        const elementIndex = !props.pagination
          ? params.rowIndex
          : params.rowIndex - paginationState.page * paginationState.pageSize;

        scrollCoordinates.top = scrollIntoView({
          clientHeight: windowRef.current!.clientHeight,
          scrollTop: windowRef.current!.scrollTop,
          offsetHeight: rowHeight,
          offsetTop: rowHeight * elementIndex,
        });
      }

      if (
        typeof scrollCoordinates.left !== undefined ||
        typeof scrollCoordinates.top !== undefined
      ) {
        apiRef.current.scroll(scrollCoordinates);
        return true;
      }

      return false;
    },
    [
      totalRowCount,
      visibleColumns,
      logger,
      apiRef,
      props.pagination,
      paginationState.page,
      paginationState.pageSize,
      windowRef,
      columnsMeta.positions,
      rowHeight,
    ],
  );

  const scroll = React.useCallback<GridScrollApi['scroll']>(
    (params: Partial<GridScrollParams>) => {
      if (windowRef.current && params.left != null && colRef.current) {
        colRef.current.scrollLeft = params.left;
        windowRef.current.scrollLeft = params.left;
        logger.debug(`Scrolling left: ${params.left}`);
      }
      if (windowRef.current && params.top != null) {
        windowRef.current.scrollTop = params.top;
        logger.debug(`Scrolling top: ${params.top}`);
      }
      logger.debug(`Scrolling, updating container, and viewport`);
    },
    [windowRef, colRef, logger],
  );

  const getScrollPosition = React.useCallback<GridScrollApi['getScrollPosition']>(
    () => scrollStateSelector(apiRef.current.getState()),
    [apiRef],
  );

  const scrollApi: GridScrollApi = {
    scroll,
    scrollToIndexes,
    getScrollPosition,
  };
  useGridApiMethod(apiRef, scrollApi, 'GridScrollApi');

  const preventScroll = React.useCallback((event: any) => {
    event.target.scrollLeft = 0;
    event.target.scrollTop = 0;
  }, []);

  useNativeEventListener(
    apiRef,
    () => apiRef.current?.renderingZoneRef?.current?.parentElement,
    'scroll',
    preventScroll,
  );

  useNativeEventListener(
    apiRef,
    () => apiRef.current?.columnHeadersContainerElementRef?.current,
    'scroll',
    preventScroll,
  );
};
