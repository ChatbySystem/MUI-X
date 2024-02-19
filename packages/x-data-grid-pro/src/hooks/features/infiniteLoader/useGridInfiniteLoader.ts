import * as React from 'react';
import {
  useGridSelector,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  useGridApiMethod,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridInfiniteLoaderApi } from './gridInfniteLoaderInterface';

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'pagination' | 'paginationMode' | 'rowsLoadingMode' | 'scrollEndThreshold'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const observer = React.useRef<IntersectionObserver>();
  const previousY = React.useRef(0);
  const previousRatio = React.useRef(0);
  const previousNode = React.useRef<HTMLElement>();

  const handleLoadMoreRows = React.useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const currentY = entry.boundingClientRect.y;
      const currentRatio = entry.intersectionRatio;
      const isIntersecting = entry.isIntersecting;

      // Scrolling down check
      if (currentY < previousY.current && isIntersecting) {
        if (currentRatio >= previousRatio.current) {
          const viewportPageSize = apiRef.current.getViewportPageSize();
          const rowScrollEndParam: GridRowScrollEndParams = {
            visibleColumns,
            viewportPageSize,
            visibleRowsCount: currentPage.rows.length,
          };
          apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParam);
        }
      }

      previousY.current = currentY;
      previousRatio.current = currentRatio;
    },
    [apiRef, visibleColumns, currentPage.rows.length],
  );

  const lastVisibleRowRef = React.useCallback<GridInfiniteLoaderApi['unstable_lastVisibleRowRef']>(
    (node) => {
      // Prevent the infite loading working in combination with lazy loading
      if (props.rowsLoadingMode !== 'client') {
        return;
      }

      if (!observer.current) {
        observer.current = new IntersectionObserver(handleLoadMoreRows, {
          threshold: 1,
          root: apiRef.current.virtualScrollerRef.current,
          rootMargin: `0px 0px ${props.scrollEndThreshold}px 0px`,
        });
      }
      if (previousNode.current !== node) {
        observer.current.disconnect();
        previousNode.current = node;
        if (node) {
          observer.current.observe(node);
        }
      }
    },
    [props.rowsLoadingMode, handleLoadMoreRows, apiRef, props.scrollEndThreshold],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_lastVisibleRowRef: lastVisibleRowRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
