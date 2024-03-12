import * as React from 'react';
import {
  unstable_ownerDocument as ownerDocument,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { useTheme, Direction } from '@mui/material/styles';
import {
  findGridCellElementsFromCol,
  findLeftPinnedCellsAfterCol,
  findRightPinnedCellsBeforeCol,
  getFieldFromHeaderElem,
  findHeaderElementFromField,
  findGroupHeaderElementsFromField,
  findGridHeader,
  findGridCells,
  findParentElementFromClassName,
  findLeftPinnedHeadersAfterCol,
  findRightPinnedHeadersBeforeCol,
} from '../../../utils/domUtils';
import {
  GridAutosizeOptions,
  GridColumnResizeApi,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from './gridColumnResizeApi';
import { CursorCoordinates } from '../../../models/cursorCoordinates';
import { GridColumnHeaderSeparatorSides } from '../../../components/columnHeaders/GridColumnHeaderSeparator';
import { gridClasses } from '../../../constants/gridClasses';
import {
  useGridApiEventHandler,
  useGridApiMethod,
  useGridApiOptionHandler,
  useGridLogger,
  useGridNativeEventListener,
  useGridSelector,
  useOnMount,
} from '../../utils';
import { gridVirtualizationColumnEnabledSelector } from '../virtualization';
import {
  ControllablePromise,
  createControllablePromise,
} from '../../../utils/createControllablePromise';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { clamp } from '../../../utils/utils';
import { useTimeout } from '../../utils/useTimeout';
import { GridPinnedColumnPosition } from '../columns/gridColumnsInterfaces';
import { gridColumnsStateSelector } from '../columns';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridColumnResizeParams } from '../../../models/params/gridColumnResizeParams';
import type { GridStateColDef } from '../../../models/colDef/gridColDef';
import type { GridEventListener } from '../../../models/events/gridEventListener';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

type AutosizeOptionsRequired = Required<GridAutosizeOptions>;

type ResizeDirection = keyof typeof GridColumnHeaderSeparatorSides;

// TODO: remove support for Safari < 13.
// https://caniuse.com/#search=touch-action
//
// Safari, on iOS, supports touch action since v13.
// Over 80% of the iOS phones are compatible
// in August 2020.
// Utilizing the CSS.supports method to check if touch-action is supported.
// Since CSS.supports is supported on all but Edge@12 and IE and touch-action
// is supported on both Edge@12 and IE if CSS.supports is not available that means that
// touch-action will be supported
let cachedSupportsTouchActionNone = false;
function doesSupportTouchActionNone(): boolean {
  if (cachedSupportsTouchActionNone === undefined) {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      cachedSupportsTouchActionNone = CSS.supports('touch-action', 'none');
    } else {
      cachedSupportsTouchActionNone = true;
    }
  }
  return cachedSupportsTouchActionNone;
}

function trackFinger(event: any, currentTouchId: number | undefined): CursorCoordinates | boolean {
  if (currentTouchId !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === currentTouchId) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function computeNewWidth(
  initialOffsetToSeparator: number,
  clickX: number,
  columnBounds: DOMRect,
  resizeDirection: ResizeDirection,
) {
  let newWidth = initialOffsetToSeparator;
  if (resizeDirection === 'Right') {
    newWidth += clickX - columnBounds.left;
  } else {
    newWidth += columnBounds.right - clickX;
  }
  return newWidth;
}

function computeOffsetToSeparator(
  clickX: number,
  columnBounds: DOMRect,
  resizeDirection: ResizeDirection,
) {
  if (resizeDirection === 'Left') {
    return clickX - columnBounds.left;
  }
  return columnBounds.right - clickX;
}

function flipResizeDirection(side: ResizeDirection) {
  if (side === 'Right') {
    return 'Left';
  }
  return 'Right';
}

function getResizeDirection(separator: HTMLElement, direction: Direction) {
  const side = separator.classList.contains(gridClasses['columnSeparator--sideRight'])
    ? 'Right'
    : 'Left';
  if (direction === 'rtl') {
    // Resizing logic should be mirrored in the RTL case
    return flipResizeDirection(side);
  }
  return side;
}

function preventClick(event: MouseEvent) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

/**
 * Checker that returns a promise that resolves when the column virtualization
 * is disabled.
 */
function useColumnVirtualizationDisabled(apiRef: React.MutableRefObject<GridPrivateApiCommunity>) {
  const promise = React.useRef<ControllablePromise>();
  const selector = () => gridVirtualizationColumnEnabledSelector(apiRef);
  const value = useGridSelector(apiRef, selector);

  React.useEffect(() => {
    if (promise.current && value === false) {
      promise.current.resolve();
      promise.current = undefined;
    }
  });

  const asyncCheck = () => {
    if (!promise.current) {
      if (selector() === false) {
        return Promise.resolve();
      }
      promise.current = createControllablePromise();
    }
    return promise.current;
  };

  return asyncCheck;
}

/**
 * Basic statistical outlier detection, checks if the value is `F * IQR` away from
 * the Q1 and Q3 boundaries. IQR: interquartile range.
 */
function excludeOutliers(inputValues: number[], factor: number) {
  if (inputValues.length < 4) {
    return inputValues;
  }

  const values = inputValues.slice();
  values.sort((a, b) => a - b);

  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75) - 1];
  const iqr = q3 - q1;

  // We make a small adjustment if `iqr < 5` for the cases where the IQR is
  // very small (e.g. zero) due to very close by values in the input data.
  // Otherwise, with an IQR of `0`, anything outside that would be considered
  // an outlier, but it makes more sense visually to allow for this 5px variance
  // rather than showing a cropped cell.
  const deviation = iqr < 5 ? 5 : iqr * factor;

  return values.filter((v) => v > q1 - deviation && v < q3 + deviation);
}

function extractColumnWidths(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  options: AutosizeOptionsRequired,
  columns: GridStateColDef[],
) {
  const widthByField = {} as Record<string, number>;

  const root = apiRef.current.rootElementRef!.current!;
  root.classList.add(gridClasses.autosizing);

  columns.forEach((column) => {
    const cells = findGridCells(apiRef.current, column.field);

    const widths = cells.map((cell) => {
      return cell.getBoundingClientRect().width ?? 0;
    });

    const filteredWidths = options.includeOutliers
      ? widths
      : excludeOutliers(widths, options.outliersFactor);

    if (options.includeHeaders) {
      const header = findGridHeader(apiRef.current, column.field);
      if (header) {
        const title = header.querySelector(`.${gridClasses.columnHeaderTitle}`);
        const content = header.querySelector(`.${gridClasses.columnHeaderTitleContainerContent}`)!;
        const iconContainer = header.querySelector(`.${gridClasses.iconButtonContainer}`);
        const menuContainer = header.querySelector(`.${gridClasses.menuIcon}`);
        const element = title ?? content;

        const style = window.getComputedStyle(header, null);
        const paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
        const contentWidth = element.scrollWidth + 1;
        const width =
          contentWidth +
          paddingWidth +
          (iconContainer?.clientWidth ?? 0) +
          (menuContainer?.clientWidth ?? 0);

        filteredWidths.push(width);
      }
    }

    const hasColumnMin = column.minWidth !== -Infinity && column.minWidth !== undefined;
    const hasColumnMax = column.maxWidth !== Infinity && column.maxWidth !== undefined;

    const min = hasColumnMin ? column.minWidth! : 0;
    const max = hasColumnMax ? column.maxWidth! : Infinity;
    const maxContent = filteredWidths.length === 0 ? 0 : Math.max(...filteredWidths);

    widthByField[column.field] = clamp(maxContent, min, max);
  });

  root.classList.remove(gridClasses.autosizing);

  return widthByField;
}

export const columnResizeStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnResize: { resizingColumnField: '' },
});
/**
 * @requires useGridColumns (method, event)
 * TODO: improve experience for last column
 */
export const useGridColumnResize = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'autosizeOptions'
    | 'autosizeOnMount'
    | 'disableAutosize'
    | 'onColumnResize'
    | 'onColumnWidthChange'
  >,
) => {
  const theme = useTheme();
  const logger = useGridLogger(apiRef, 'useGridColumnResize');

  const colDefRef = React.useRef<GridStateColDef>();
  const previousMouseClickEvent = React.useRef<MouseEvent>();
  const columnHeaderElementRef = React.useRef<HTMLDivElement>();
  const headerFilterElementRef = React.useRef<HTMLDivElement>();
  const groupHeaderElementsRef = React.useRef<Element[]>([]);
  const cellElementsRef = React.useRef<Element[]>([]);
  const leftPinnedCellsAfterRef = React.useRef<HTMLElement[]>([]);
  const rightPinnedCellsBeforeRef = React.useRef<HTMLElement[]>([]);
  const leftPinnedHeadersAfterRef = React.useRef<HTMLElement[]>([]);
  const rightPinnedHeadersAfterRef = React.useRef<HTMLElement[]>([]);

  // To improve accessibility, the separator has padding on both sides.
  // Clicking inside the padding area should be treated as a click in the separator.
  // This ref stores the offset between the click and the separator.
  const initialOffsetToSeparator = React.useRef<number>();
  const resizeDirection = React.useRef<ResizeDirection>();

  const stopResizeEventTimeout = useTimeout();
  const touchId = React.useRef<number>();

  const updateWidth = (newWidth: number) => {
    logger.debug(`Updating width to ${newWidth} for col ${colDefRef.current!.field}`);

    const prevWidth = columnHeaderElementRef.current!.offsetWidth;
    const widthDiff = newWidth - prevWidth;

    colDefRef.current!.computedWidth = newWidth;
    colDefRef.current!.width = newWidth;
    colDefRef.current!.flex = 0;

    columnHeaderElementRef.current!.style.width = `${newWidth}px`;
    columnHeaderElementRef.current!.style.minWidth = `${newWidth}px`;
    columnHeaderElementRef.current!.style.maxWidth = `${newWidth}px`;

    const headerFilterElement = headerFilterElementRef.current;
    if (headerFilterElement) {
      headerFilterElement.style.width = `${newWidth}px`;
      headerFilterElement.style.minWidth = `${newWidth}px`;
      headerFilterElement.style.maxWidth = `${newWidth}px`;
    }

    groupHeaderElementsRef.current!.forEach((element) => {
      const div = element as HTMLDivElement;
      let finalWidth: `${number}px`;

      if (div.getAttribute('aria-colspan') === '1') {
        finalWidth = `${newWidth}px`;
      } else {
        // Cell with colspan > 1 cannot be just updated width new width.
        // Instead, we add width diff to the current width.
        finalWidth = `${div.offsetWidth + widthDiff}px`;
      }

      div.style.width = finalWidth;
      div.style.minWidth = finalWidth;
      div.style.maxWidth = finalWidth;
    });

    cellElementsRef.current!.forEach((element) => {
      const div = element as HTMLDivElement;
      let finalWidth: `${number}px`;

      if (div.getAttribute('aria-colspan') === '1') {
        finalWidth = `${newWidth}px`;
      } else {
        // Cell with colspan > 1 cannot be just updated width new width.
        // Instead, we add width diff to the current width.
        finalWidth = `${div.offsetWidth + widthDiff}px`;
      }

      div.style.setProperty('--width', finalWidth);
    });

    const pinnedPosition = apiRef.current.unstable_applyPipeProcessors(
      'isColumnPinned',
      false,
      colDefRef.current!.field,
    );

    if (pinnedPosition === GridPinnedColumnPosition.LEFT) {
      leftPinnedCellsAfterRef.current.forEach((cell) => {
        updateProperty(cell, 'left', widthDiff);
      });
      leftPinnedHeadersAfterRef.current.forEach((header) => {
        updateProperty(header, 'left', widthDiff);
      });
    }

    if (pinnedPosition === GridPinnedColumnPosition.RIGHT) {
      rightPinnedCellsBeforeRef.current.forEach((cell) => {
        updateProperty(cell, 'right', widthDiff);
      });
      rightPinnedHeadersAfterRef.current.forEach((header) => {
        updateProperty(header, 'right', widthDiff);
      });
    }
  };

  const finishResize = (nativeEvent: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    // Prevent double-clicks from being interpreted as two separate clicks
    if (previousMouseClickEvent.current) {
      const prevEvent = previousMouseClickEvent.current;
      const prevTimeStamp = prevEvent.timeStamp;
      const prevClientX = prevEvent.clientX;
      const prevClientY = prevEvent.clientY;

      // Check if the current event is part of a double-click
      if (
        nativeEvent.timeStamp - prevTimeStamp < 300 &&
        nativeEvent.clientX === prevClientX &&
        nativeEvent.clientY === prevClientY
      ) {
        previousMouseClickEvent.current = undefined;
        return;
      }
    }

    if (colDefRef.current) {
      apiRef.current.setColumnWidth(colDefRef.current.field, colDefRef.current.width!);
      logger.debug(
        `Updating col ${colDefRef.current.field} with new width: ${colDefRef.current.width}`,
      );
    }

    stopResizeEventTimeout.start(0, () => {
      apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
    });
  };

  const storeReferences = (colDef: GridStateColDef, separator: HTMLElement, xStart: number) => {
    const root = apiRef.current.rootElementRef.current!;

    colDefRef.current = colDef as GridStateColDef;

    columnHeaderElementRef.current = findHeaderElementFromField(
      apiRef.current.columnHeadersContainerElementRef!.current!,
      colDef.field,
    );

    const headerFilterElement = root.querySelector(
      `.${gridClasses.headerFilterRow} [data-field="${colDef.field}"]`,
    );
    if (headerFilterElement) {
      headerFilterElementRef.current = headerFilterElement as HTMLDivElement;
    }

    groupHeaderElementsRef.current = findGroupHeaderElementsFromField(
      apiRef.current.columnHeadersContainerElementRef?.current!,
      colDef.field,
    );

    cellElementsRef.current = findGridCellElementsFromCol(
      columnHeaderElementRef.current,
      apiRef.current,
    );

    const pinnedPosition = apiRef.current.unstable_applyPipeProcessors(
      'isColumnPinned',
      false,
      colDefRef.current!.field,
    );

    leftPinnedCellsAfterRef.current =
      pinnedPosition !== GridPinnedColumnPosition.LEFT
        ? []
        : findLeftPinnedCellsAfterCol(apiRef.current, columnHeaderElementRef.current);
    rightPinnedCellsBeforeRef.current =
      pinnedPosition !== GridPinnedColumnPosition.RIGHT
        ? []
        : findRightPinnedCellsBeforeCol(apiRef.current, columnHeaderElementRef.current);

    leftPinnedHeadersAfterRef.current =
      pinnedPosition !== GridPinnedColumnPosition.LEFT
        ? []
        : findLeftPinnedHeadersAfterCol(apiRef.current, columnHeaderElementRef.current);
    rightPinnedHeadersAfterRef.current =
      pinnedPosition !== GridPinnedColumnPosition.RIGHT
        ? []
        : findRightPinnedHeadersBeforeCol(apiRef.current, columnHeaderElementRef.current);

    resizeDirection.current = getResizeDirection(separator, theme.direction);

    initialOffsetToSeparator.current = computeOffsetToSeparator(
      xStart,
      columnHeaderElementRef.current!.getBoundingClientRect(),
      resizeDirection.current,
    );
  };

  const handleResizeMouseUp = useEventCallback(finishResize);

  const handleResizeMouseMove = useEventCallback((nativeEvent: MouseEvent) => {
    // Cancel move in case some other element consumed a mouseup event and it was not fired.
    if (nativeEvent.buttons === 0) {
      handleResizeMouseUp(nativeEvent);
      return;
    }

    let newWidth = computeNewWidth(
      initialOffsetToSeparator.current!,
      nativeEvent.clientX,
      columnHeaderElementRef.current!.getBoundingClientRect(),
      resizeDirection.current!,
    );

    newWidth = clamp(newWidth, colDefRef.current!.minWidth!, colDefRef.current!.maxWidth!);
    updateWidth(newWidth);

    const params: GridColumnResizeParams = {
      element: columnHeaderElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent('columnResize', params, nativeEvent);
  });

  const handleTouchEnd = useEventCallback((nativeEvent: any) => {
    const finger = trackFinger(nativeEvent, touchId.current);

    if (!finger) {
      return;
    }

    finishResize(nativeEvent);
  });

  const handleTouchMove = useEventCallback((nativeEvent: any) => {
    const finger = trackFinger(nativeEvent, touchId.current);
    if (!finger) {
      return;
    }

    // Cancel move in case some other element consumed a touchmove event and it was not fired.
    if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
      handleTouchEnd(nativeEvent);
      return;
    }

    let newWidth = computeNewWidth(
      initialOffsetToSeparator.current!,
      (finger as CursorCoordinates).x,
      columnHeaderElementRef.current!.getBoundingClientRect(),
      resizeDirection.current!,
    );

    newWidth = clamp(newWidth, colDefRef.current!.minWidth!, colDefRef.current!.maxWidth!);
    updateWidth(newWidth);

    const params: GridColumnResizeParams = {
      element: columnHeaderElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent('columnResize', params, nativeEvent);
  });

  const handleTouchStart = useEventCallback((event: any) => {
    const cellSeparator = findParentElementFromClassName(
      event.target,
      gridClasses['columnSeparator--resizable'],
    ) as HTMLElement | null;
    // Let the event bubble if the target is not a col separator
    if (!cellSeparator) {
      return;
    }
    // If touch-action: none; is not supported we need to prevent the scroll manually.
    if (!doesSupportTouchActionNone()) {
      event.preventDefault();
    }

    const touch = event.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }

    const columnHeaderElement = findParentElementFromClassName(
      event.target,
      gridClasses.columnHeader,
    ) as HTMLDivElement;
    const field = getFieldFromHeaderElem(columnHeaderElement);
    const colDef = apiRef.current.getColumn(field);

    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent('columnResizeStart', { field }, event);

    storeReferences(colDef, cellSeparator, touch.clientX);

    const doc = ownerDocument(event.currentTarget as HTMLElement);
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  const stopListening = React.useCallback(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current);
    doc.body.style.removeProperty('cursor');
    doc.removeEventListener('mousemove', handleResizeMouseMove);
    doc.removeEventListener('mouseup', handleResizeMouseUp);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
    // The click event runs right after the mouseup event, we want to wait until it
    // has been canceled before removing our handler.
    setTimeout(() => {
      doc.removeEventListener('click', preventClick, true);
    }, 100);
    if (columnHeaderElementRef.current) {
      columnHeaderElementRef.current!.style.pointerEvents = 'unset';
    }
  }, [
    apiRef,
    columnHeaderElementRef,
    handleResizeMouseMove,
    handleResizeMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const handleResizeStart = React.useCallback<GridEventListener<'columnResizeStart'>>(
    ({ field }) => {
      apiRef.current.setState((state) => ({
        ...state,
        columnResize: { ...state.columnResize, resizingColumnField: field },
      }));
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const handleResizeStop = React.useCallback<GridEventListener<'columnResizeStop'>>(() => {
    apiRef.current.setState((state) => ({
      ...state,
      columnResize: { ...state.columnResize, resizingColumnField: '' },
    }));
    apiRef.current.forceUpdate();
  }, [apiRef]);

  const handleColumnResizeMouseDown: GridEventListener<'columnSeparatorMouseDown'> =
    useEventCallback(({ colDef }, event) => {
      // Only handle left clicks
      if (event.button !== 0) {
        return;
      }

      // Skip if the column isn't resizable
      if (!event.currentTarget.classList.contains(gridClasses['columnSeparator--resizable'])) {
        return;
      }

      // Avoid text selection
      event.preventDefault();

      logger.debug(`Start Resize on col ${colDef.field}`);
      apiRef.current.publishEvent('columnResizeStart', { field: colDef.field }, event);

      storeReferences(colDef, event.currentTarget, event.clientX);

      const doc = ownerDocument(apiRef.current.rootElementRef!.current);
      doc.body.style.cursor = 'col-resize';

      previousMouseClickEvent.current = event.nativeEvent;

      doc.addEventListener('mousemove', handleResizeMouseMove);
      doc.addEventListener('mouseup', handleResizeMouseUp);

      // Prevent the click event if we have resized the column.
      // Fixes https://github.com/mui/mui-x/issues/4777
      doc.addEventListener('click', preventClick, true);
    });

  const handleColumnSeparatorDoubleClick: GridEventListener<'columnSeparatorDoubleClick'> =
    useEventCallback((params, event) => {
      if (props.disableAutosize) {
        return;
      }

      // Only handle left clicks
      if (event.button !== 0) {
        return;
      }

      const column = apiRef.current.state.columns.lookup[params.field];
      if (column.resizable === false) {
        return;
      }

      apiRef.current.autosizeColumns({
        ...props.autosizeOptions,
        columns: [column.field],
      });
    });

  /**
   * API METHODS
   */

  const columnVirtualizationDisabled = useColumnVirtualizationDisabled(apiRef);
  const isAutosizingRef = React.useRef(false);
  const autosizeColumns = React.useCallback<GridColumnResizeApi['autosizeColumns']>(
    async (userOptions) => {
      const root = apiRef.current.rootElementRef?.current;
      if (!root) {
        return;
      }
      if (isAutosizingRef.current) {
        return;
      }
      isAutosizingRef.current = true;

      const state = gridColumnsStateSelector(apiRef.current.state);
      const options = {
        ...DEFAULT_GRID_AUTOSIZE_OPTIONS,
        ...userOptions,
        columns: userOptions?.columns ?? state.orderedFields,
      };
      options.columns = options.columns.filter((c) => state.columnVisibilityModel[c] !== false);

      const columns = options.columns.map((c) => apiRef.current.state.columns.lookup[c]);

      try {
        apiRef.current.unstable_setColumnVirtualization(false);
        await columnVirtualizationDisabled();

        const widthByField = extractColumnWidths(apiRef, options, columns);

        const newColumns = columns.map((column) => ({
          ...column,
          width: widthByField[column.field],
          computedWidth: widthByField[column.field],
        }));

        if (options.expand) {
          const visibleColumns = state.orderedFields
            .map((field) => state.lookup[field])
            .filter((c) => state.columnVisibilityModel[c.field] !== false);

          const totalWidth = visibleColumns.reduce(
            (total, column) =>
              total + (widthByField[column.field] ?? column.computedWidth ?? column.width),
            0,
          );
          const availableWidth = apiRef.current.getRootDimensions().viewportInnerSize.width;
          const remainingWidth = availableWidth - totalWidth;

          if (remainingWidth > 0) {
            const widthPerColumn = remainingWidth / (newColumns.length || 1);
            newColumns.forEach((column) => {
              column.width += widthPerColumn;
              column.computedWidth += widthPerColumn;
            });
          }
        }

        apiRef.current.updateColumns(newColumns);

        newColumns.forEach((newColumn, index) => {
          if (newColumn.width !== columns[index].width) {
            const width = newColumn.width;
            apiRef.current.publishEvent('columnWidthChange', {
              element: apiRef.current.getColumnHeaderElement(newColumn.field),
              colDef: newColumn,
              width,
            });
          }
        });
      } finally {
        apiRef.current.unstable_setColumnVirtualization(true);
        isAutosizingRef.current = false;
      }
    },
    [apiRef, columnVirtualizationDisabled],
  );

  /**
   * EFFECTS
   */

  React.useEffect(() => stopListening, [stopListening]);

  useOnMount(() => {
    if (props.autosizeOnMount) {
      Promise.resolve().then(() => {
        apiRef.current.autosizeColumns(props.autosizeOptions);
      });
    }
  });

  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.columnHeadersContainerElementRef?.current,
    'touchstart',
    handleTouchStart,
    { passive: doesSupportTouchActionNone() },
  );

  useGridApiMethod(
    apiRef,
    {
      autosizeColumns,
    },
    'public',
  );

  useGridApiEventHandler(apiRef, 'columnResizeStop', handleResizeStop);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleResizeStart);
  useGridApiEventHandler(apiRef, 'columnSeparatorMouseDown', handleColumnResizeMouseDown);
  useGridApiEventHandler(apiRef, 'columnSeparatorDoubleClick', handleColumnSeparatorDoubleClick);

  useGridApiOptionHandler(apiRef, 'columnResize', props.onColumnResize);
  useGridApiOptionHandler(apiRef, 'columnWidthChange', props.onColumnWidthChange);
};

function updateProperty(
  element: HTMLElement | undefined,
  property: 'right' | 'left' | 'width',
  delta: number,
) {
  if (!element) {
    return;
  }
  element.style[property] = `${parseInt(element.style[property], 10) + delta}px`;
}
