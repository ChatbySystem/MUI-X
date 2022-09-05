import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  CursorCoordinates,
  useGridApiEventHandler,
  getDataGridUtilityClass,
  GridEventListener,
  useGridLogger,
} from '@mui/x-data-grid';
import { GridStateInitializer } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { gridColumnReorderDragColSelector } from './columnReorderSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

const CURSOR_MOVE_DIRECTION_LEFT = 'left';
const CURSOR_MOVE_DIRECTION_RIGHT = 'right';

const getCursorMoveDirectionX = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
) => {
  return currentCoordinates.x <= nextCoordinates.x
    ? CURSOR_MOVE_DIRECTION_RIGHT
    : CURSOR_MOVE_DIRECTION_LEFT;
};

const hasCursorPositionChanged = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
): boolean =>
  currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    columnHeaderDragging: ['columnHeader--dragging'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const columnReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnReorder: { dragCol: '' },
});

/**
 * @requires useGridColumns (method)
 */
export const useGridColumnReorder = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'disableColumnReorder' | 'classes'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnReorder');

  const dragColNode = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const originColumnIndex = React.useRef<number | null>(null);
  const forbiddenIndexes = React.useRef<{ [key: number]: boolean }>({});
  const removeDnDStylesTimeout = React.useRef<any>();
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const handleDragStart = React.useCallback<GridEventListener<'columnHeaderDragStart'>>(
    (params, event) => {
      if (props.disableColumnReorder || params.colDef.disableReorder) {
        return;
      }

      logger.debug(`Start dragging col ${params.field}`);
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      dragColNode.current = event.currentTarget;
      dragColNode.current.classList.add(classes.columnHeaderDragging);

      apiRef.current.setState((state) => ({
        ...state,
        columnReorder: { ...state.columnReorder, dragCol: params.field },
      }));
      apiRef.current.forceUpdate();

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragColNode.current!.classList.remove(classes.columnHeaderDragging);
      });

      originColumnIndex.current = apiRef.current.getColumnIndex(params.field, false);

      const draggingColumnGroupPath = apiRef.current.unstable_getColumnGroupPath(params.field);

      const columnIndex = originColumnIndex.current;
      const allColumns = apiRef.current.getAllColumns();
      const groupsLookup = apiRef.current.unstable_getAllGroupDetails();

      const getGroupPathFromColumnIndex = (colIndex: number) => {
        const field = allColumns[colIndex].field;
        return apiRef.current.unstable_getColumnGroupPath(field);
      };

      // The limitingGroupId is the id of the group from which the dragged column should not escape
      let limitingGroupId: string | null = null;

      draggingColumnGroupPath.forEach((groupId) => {
        if (!groupsLookup[groupId]?.freeReordering) {
          const previousColumnGroupPath = getGroupPathFromColumnIndex(columnIndex - 1);
          const nextColumnGroupPath = getGroupPathFromColumnIndex(columnIndex + 1);

          // Only consider group that are made of more than one column
          if (columnIndex > 0 && previousColumnGroupPath.includes(groupId)) {
            limitingGroupId = groupId;
          } else if (columnIndex + 1 < allColumns.length && nextColumnGroupPath.includes(groupId)) {
            limitingGroupId = groupId;
          }
        }
      });

      forbiddenIndexes.current = {};

      for (let indexToForbid = 0; indexToForbid < allColumns.length; indexToForbid += 1) {
        const leftIndex = indexToForbid <= columnIndex ? indexToForbid - 1 : indexToForbid;
        const rightIndex = indexToForbid < columnIndex ? indexToForbid : indexToForbid + 1;

        const rightColumnGroupPath = getGroupPathFromColumnIndex(rightIndex);
        const leftColumnGroupPath = getGroupPathFromColumnIndex(leftIndex);
        if (limitingGroupId !== null) {
          // verify this indexToForbid will be linked to the limiting group. Otherwise forbid it
          let allowIndex = false;
          if (leftIndex >= 0 && leftColumnGroupPath.includes(limitingGroupId)) {
            allowIndex = true;
          } else if (
            rightIndex < allColumns.length &&
            rightColumnGroupPath.includes(limitingGroupId)
          ) {
            allowIndex = true;
          }
          if (!allowIndex) {
            forbiddenIndexes.current[indexToForbid] = true;
          }
        }

        // Verify we are not splitting another group
        if (leftIndex >= 0 && rightIndex < allColumns.length) {
          rightColumnGroupPath.forEach((groupId) => {
            if (leftColumnGroupPath.includes(groupId)) {
              if (!draggingColumnGroupPath.includes(groupId)) {
                // moving here split the group groupId in two distincts chunks
                if (!groupsLookup[groupId]?.freeReordering) {
                  forbiddenIndexes.current[indexToForbid] = true;
                }
              }
            }
          });
        }
      }
    },
    [props.disableColumnReorder, classes.columnHeaderDragging, logger, apiRef],
  );

  const handleDragEnter = React.useCallback<
    GridEventListener<'cellDragEnter' | 'columnHeaderDragEnter'>
  >((params, event) => {
    event.preventDefault();
    // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.
    event.stopPropagation();
  }, []);

  const handleDragOver = React.useCallback<
    GridEventListener<'cellDragOver' | 'columnHeaderDragOver'>
  >(
    (params, event) => {
      const dragColField = gridColumnReorderDragColSelector(apiRef);
      if (!dragColField) {
        return;
      }

      logger.debug(`Dragging over col ${params.field}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      const coordinates = { x: event.clientX, y: event.clientY };

      if (
        params.field !== dragColField &&
        hasCursorPositionChanged(cursorPosition.current, coordinates)
      ) {
        const targetColIndex = apiRef.current.getColumnIndex(params.field, false);
        const targetColVisibleIndex = apiRef.current.getColumnIndex(params.field, true);
        const targetCol = apiRef.current.getColumn(params.field);
        const dragColIndex = apiRef.current.getColumnIndex(dragColField, false);
        const visibleColumns = apiRef.current.getVisibleColumns();
        const allColumns = apiRef.current.getAllColumns();

        const cursorMoveDirectionX = getCursorMoveDirectionX(cursorPosition.current, coordinates);
        const hasMovedLeft =
          cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_LEFT && targetColIndex < dragColIndex;
        const hasMovedRight =
          cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_RIGHT && dragColIndex < targetColIndex;

        if (hasMovedLeft || hasMovedRight) {
          let canBeReordered: boolean;
          let indexOffsetInHiddenColumns = 0;
          if (!targetCol.disableReorder) {
            canBeReordered = true;
          } else if (hasMovedLeft) {
            canBeReordered =
              targetColVisibleIndex > 0 &&
              !visibleColumns[targetColVisibleIndex - 1].disableReorder;
          } else {
            canBeReordered =
              targetColVisibleIndex < visibleColumns.length - 1 &&
              !visibleColumns[targetColVisibleIndex + 1].disableReorder;
          }

          if (forbiddenIndexes.current[targetColIndex]) {
            let nextVisibleColumnField: string | null;
            let indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
            if (hasMovedLeft) {
              nextVisibleColumnField =
                targetColVisibleIndex > 0 ? visibleColumns[targetColVisibleIndex - 1].field : null;
              while (
                indexWithOffset > 0 &&
                allColumns[indexWithOffset].field !== nextVisibleColumnField &&
                forbiddenIndexes.current[indexWithOffset]
              ) {
                indexOffsetInHiddenColumns -= 1;
                indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
              }
            } else {
              nextVisibleColumnField =
                targetColVisibleIndex + 1 < visibleColumns.length
                  ? visibleColumns[targetColVisibleIndex + 1].field
                  : null;
              while (
                indexWithOffset < allColumns.length - 1 &&
                allColumns[indexWithOffset].field !== nextVisibleColumnField &&
                forbiddenIndexes.current[indexWithOffset]
              ) {
                indexOffsetInHiddenColumns += 1;
                indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
              }
            }

            if (
              forbiddenIndexes.current[indexWithOffset] ||
              allColumns[indexWithOffset].field === nextVisibleColumnField
            ) {
              // If we ended up on a visible column, or a forbidden one, we can not do the reorder
              canBeReordered = false;
            }
          }

          const canBeReorderedProcessed = apiRef.current.unstable_applyPipeProcessors(
            'canBeReordered',
            canBeReordered,
            { targetIndex: targetColVisibleIndex },
          );

          if (canBeReorderedProcessed) {
            apiRef.current.setColumnIndex(
              dragColField,
              targetColIndex + indexOffsetInHiddenColumns,
            );
          }
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, logger],
  );

  const handleDragEnd = React.useCallback<GridEventListener<'columnHeaderDragEnd'>>(
    (params, event): void => {
      const dragColField = gridColumnReorderDragColSelector(apiRef);
      if (props.disableColumnReorder || !dragColField) {
        return;
      }

      logger.debug('End dragging col');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);
      dragColNode.current = null;

      // Check if the column was dropped outside the grid.
      if (event.dataTransfer.dropEffect === 'none') {
        // Accessing params.field may contain the wrong field as header elements are reused
        apiRef.current.setColumnIndex(dragColField, originColumnIndex.current!);
        originColumnIndex.current = null;
      }

      apiRef.current.setState((state) => ({
        ...state,
        columnReorder: { ...state.columnReorder, dragCol: '' },
      }));
      apiRef.current.forceUpdate();
    },
    [props.disableColumnReorder, logger, apiRef],
  );

  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleDragStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnter', handleDragEnter);
  useGridApiEventHandler(apiRef, 'columnHeaderDragOver', handleDragOver);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleDragEnd);
  useGridApiEventHandler(apiRef, 'cellDragEnter', handleDragEnter);
  useGridApiEventHandler(apiRef, 'cellDragOver', handleDragOver);
};
