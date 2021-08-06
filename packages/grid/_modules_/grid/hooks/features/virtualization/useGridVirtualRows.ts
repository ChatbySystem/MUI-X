import * as React from 'react';
import { GRID_PAGE_CHANGE, GRID_ROWS_SCROLL } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridVirtualizationApi } from '../../../models/api/gridVirtualizationApi';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import {
  GridRenderColumnsProps,
  GridRenderContextProps,
  GridRenderPaginationProps,
  GridRenderRowProps,
} from '../../../models/gridRenderContextProps';
import { isDeepEqual } from '../../../utils/utils';
import { useEnhancedEffect } from '../../../utils/material-ui-utils';
import { optionsSelector } from '../../utils/optionsSelector';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { useLogger } from '../../utils/useLogger';
import { useGridScrollFn } from '../../utils/useGridScrollFn';
import { InternalRenderingState } from './renderingState';
import { useGridVirtualColumns } from './useGridVirtualColumns';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { scrollStateSelector } from './renderingStateSelector';
import { useGridApiEventHandler } from '../../root';
import { GridComponentProps } from '../../../GridComponentProps';

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

export const useGridVirtualRows = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination' | 'paginationMode' | 'page'>,
): void => {
  const logger = useLogger('useGridVirtualRows');
  const colRef = apiRef.current.columnHeadersElementRef!;
  const windowRef = apiRef.current.windowRef!;
  const renderingZoneRef = apiRef.current.renderingZoneRef!;

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);

  const [scrollTo] = useGridScrollFn(renderingZoneRef, colRef);
  const [renderedColRef, updateRenderedCols] = useGridVirtualColumns(options, apiRef);

  const setRenderingState = React.useCallback(
    (newState: Partial<InternalRenderingState>) => {
      let stateChanged = false;
      setGridState((state) => {
        const currentRenderingState = { ...state.rendering, ...newState };
        if (!isDeepEqual(state.rendering, currentRenderingState)) {
          stateChanged = true;
          return { ...state, rendering: currentRenderingState };
        }
        return state;
      });
      return stateChanged;
    },
    [setGridState],
  );

  const getRenderingState = React.useCallback((): GridRenderContextProps | null => {
    const state = apiRef.current.getState();

    if (!state.containerSizes || !renderedColRef.current) {
      return null;
    }
    let minRowIdx = 0;

    if (
      props.pagination &&
      state.pagination.pageSize != null &&
      props.paginationMode === 'client'
    ) {
      minRowIdx = state.pagination.pageSize * state.pagination.page;
    }

    const firstRowIdx =
      state.rendering.virtualPage * state.containerSizes.viewportPageSize + minRowIdx;
    let lastRowIdx = firstRowIdx + state.containerSizes.renderingZonePageSize;
    const maxIndex = state.containerSizes.virtualRowsCount + minRowIdx;
    if (lastRowIdx > maxIndex) {
      lastRowIdx = maxIndex;
    }

    const rowProps: GridRenderRowProps = {
      page: state.rendering.virtualPage,
      firstRowIdx,
      lastRowIdx,
    };

    const columnsProps: GridRenderColumnsProps = renderedColRef.current;

    const paginationProps: GridRenderPaginationProps = {
      paginationCurrentPage: state.pagination.page,
      pageSize: state.pagination.pageSize,
    };

    return {
      ...columnsProps,
      ...rowProps,
      ...paginationProps,
    };
  }, [renderedColRef, apiRef, props.pagination, props.paginationMode]);

  const reRender = React.useCallback(() => {
    const renderingState = getRenderingState();
    const hasChanged = setRenderingState({
      renderContext: renderingState,
      renderedSizes: apiRef.current.state.containerSizes,
    });
    if (hasChanged) {
      logger.debug('reRender: trigger rendering');
      forceUpdate();
    }
  }, [apiRef, getRenderingState, logger, forceUpdate, setRenderingState]);

  const updateViewport = React.useCallback(
    (forceReRender = false) => {
      const lastState = apiRef.current.getState();
      const containerProps = lastState.containerSizes;
      if (!windowRef || !windowRef.current || !containerProps) {
        return;
      }
      const scrollBar = lastState.scrollBar;

      const { scrollLeft, scrollTop } = windowRef.current;
      logger.debug(`Handling scroll Left: ${scrollLeft} Top: ${scrollTop}`);

      let requireRerender = updateRenderedCols(containerProps, scrollLeft);

      const rzScrollLeft = scrollLeft;
      const maxScrollHeight = lastState.containerSizes!.renderingZoneScrollHeight;

      const page = lastState.rendering.virtualPage;
      const nextPage = maxScrollHeight > 0 ? Math.floor(scrollTop / maxScrollHeight) : 0;
      const rzScrollTop = scrollTop % maxScrollHeight;

      const scrollParams = {
        left: scrollBar.hasScrollX ? rzScrollLeft : 0,
        top: containerProps.isVirtualized ? rzScrollTop : scrollTop,
      };

      if (containerProps.isVirtualized && page !== nextPage) {
        setRenderingState({ virtualPage: nextPage });
        logger.debug(`Changing page from ${page} to ${nextPage}`);
        requireRerender = true;
      } else {
        if (!containerProps.isVirtualized && page > 0) {
          logger.debug(`Virtualization disabled, setting virtualPage to 0`);
          setRenderingState({ virtualPage: 0 });
        }

        scrollTo(scrollParams);
      }
      setRenderingState({
        renderingZoneScroll: scrollParams,
        realScroll: {
          left: windowRef.current.scrollLeft,
          top: windowRef.current.scrollTop,
        },
      });
      apiRef.current.publishEvent(GRID_ROWS_SCROLL, scrollParams);

      const pageChanged =
        lastState.rendering.renderContext &&
        lastState.rendering.renderContext.paginationCurrentPage !==
          apiRef.current.getState().pagination.page;
      if (forceReRender || requireRerender || pageChanged) {
        reRender();
      }
    },
    [apiRef, logger, reRender, scrollTo, setRenderingState, updateRenderedCols, windowRef],
  );

  const scrollToIndexes = React.useCallback(
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
        const state = apiRef.current.getState();

        const elementIndex = !options.pagination
          ? params.rowIndex
          : params.rowIndex - state.pagination.page * state.pagination.pageSize;

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
      options.pagination,
      windowRef,
      columnsMeta.positions,
      rowHeight,
    ],
  );

  const resetScroll = React.useCallback(() => {
    scrollTo({ left: 0, top: 0 });
    setRenderingState({ virtualPage: 0 });

    if (windowRef && windowRef.current) {
      windowRef.current.scrollTop = 0;
      windowRef.current.scrollLeft = 0;
    }
    setRenderingState({ renderingZoneScroll: { left: 0, top: 0 } });
  }, [scrollTo, setRenderingState, windowRef]);

  const scrollingTimeout = React.useRef<any>(null);
  const handleScroll = React.useCallback(() => {
    // On iOS the inertia scrolling allows to return negative values.
    if (windowRef.current!.scrollLeft < 0 || windowRef.current!.scrollTop < 0) return;

    if (!scrollingTimeout.current) {
      setGridState((state) => ({ ...state, isScrolling: true }));
    }
    clearTimeout(scrollingTimeout.current);
    scrollingTimeout.current = setTimeout(() => {
      scrollingTimeout.current = null;
      setGridState((state) => ({ ...state, isScrolling: false }));
      forceUpdate();
    }, 300);

    apiRef.current.updateViewport();
  }, [windowRef, apiRef, setGridState, forceUpdate]);

  const scroll = React.useCallback(
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

  const getScrollPosition = React.useCallback(
    () => scrollStateSelector(apiRef.current.getState()),
    [apiRef],
  );

  const getContainerPropsState = React.useCallback(
    () => gridState.containerSizes,
    [gridState.containerSizes],
  );

  const getRenderContextState = React.useCallback(() => {
    return gridState.rendering.renderContext || undefined;
  }, [gridState.rendering.renderContext]);

  useEnhancedEffect(() => {
    if (renderingZoneRef && renderingZoneRef.current) {
      logger.debug('applying scrollTop ', gridState.rendering.renderingZoneScroll.top);
      scrollTo(gridState.rendering.renderingZoneScroll);
    }
  });

  const virtualApi: Partial<GridVirtualizationApi> = {
    scroll,
    scrollToIndexes,
    getContainerPropsState,
    getRenderContextState,
    getScrollPosition,
    updateViewport,
  };
  useGridApiMethod(apiRef, virtualApi, 'GridVirtualizationApi');

  React.useEffect(() => {
    logger.debug(
      `totalRowCount has changed to ${totalRowCount} or containerSizes changed, updating viewport.`,
    );
    apiRef.current.updateViewport(true);
  }, [logger, totalRowCount, apiRef, gridState.containerSizes]);

  React.useEffect(() => {
    return () => {
      clearTimeout(scrollingTimeout.current);
    };
  }, []);

  const preventScroll = React.useCallback((event: any) => {
    event.target.scrollLeft = 0;
    event.target.scrollTop = 0;
  }, []);

  useNativeEventListener(apiRef, windowRef, 'scroll', handleScroll, { passive: true });
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

  const handlePageChange = React.useCallback(
    (page: number) => {
      logger.debug(`State paginationState.page changed to ${page}. `);
      apiRef.current.updateViewport(true);
      resetScroll();
    },
    [apiRef, logger, resetScroll],
  );

  useGridApiEventHandler(apiRef, GRID_PAGE_CHANGE, handlePageChange);

  // We need to listen manually to the prop update because the GRID_PAGE_CHANGE event is not triggered when the prop in controlled and changed
  React.useEffect(() => {
    logger.debug(`Controlled props.page changed to ${props.page}. `);
    apiRef.current.updateViewport(true);
    resetScroll();
  }, [resetScroll, apiRef, logger, props.page]);
};
