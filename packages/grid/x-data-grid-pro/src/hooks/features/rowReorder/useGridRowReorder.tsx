import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  useGridLogger,
  GridEvents,
  useGridApiEventHandler,
  GridEventListener,
  getDataGridUtilityClass,
  useGridSelector,
  gridSortModelSelector,
  gridRowTreeDepthSelector,
  useGridApiOptionHandler,
  GridRowId,
} from '@mui/x-data-grid';
import { GridRowOrderChangeParams } from '@mui/x-data-grid-pro/models';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    rowDragging: ['row--dragging'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

/**
 * Only available in DataGridPro
 * @requires useGridRows (method)
 */
export const useGridRowReorder = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'enableRowReorder' | 'onRowOrderChange' | 'classes'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorder');
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowTreeDepthSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const originRowIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<any>();
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const [dragRowId, setDragRowId] = React.useState<GridRowId>('');

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  // TODO: remove sortModel check once row reorder is sorting compatible
  // remove treeDepth once row reorder is tree compatible
  const isRowReorderDisabled = React.useMemo((): boolean => {
    return !props.enableRowReorder || !!sortModel.length || treeDepth !== 1;
  }, [props.enableRowReorder, sortModel, treeDepth]);

  const handleDragStart = React.useCallback<GridEventListener<GridEvents.rowDragStart>>(
    (params, event) => {
      if (isRowReorderDisabled) {
        return;
      }

      logger.debug(`Start dragging row ${params.id}`);
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      dragRowNode.current = event.currentTarget;
      dragRowNode.current.classList.add(classes.rowDragging);

      setDragRowId(params.id);

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragRowNode.current!.classList.remove(classes.rowDragging);
      });

      originRowIndex.current = apiRef.current.getRowIndex(params.id);
    },
    [isRowReorderDisabled, classes.rowDragging, logger, apiRef],
  );

  const handleDragOver = React.useCallback<
    GridEventListener<GridEvents.cellDragOver | GridEvents.rowDragOver>
  >(
    (params, event) => {
      if (!dragRowId && dragRowId !== 0) {
        return;
      }
      logger.debug(`Dragging over row ${params.id}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      if (params.id !== dragRowId) {
        const targetRowIndex = apiRef.current.getRowIndex(params.id);
        const dragRowIndex = apiRef.current.getRowIndex(dragRowId);

        apiRef.current.setRowIndex(dragRowId, targetRowIndex);

        const rowOrderChangeParams: GridRowOrderChangeParams = {
          row: apiRef.current.getRow(dragRowId),
          targetIndex: targetRowIndex,
          oldIndex: dragRowIndex,
        };
        apiRef.current.publishEvent(GridEvents.rowOrderChange, rowOrderChangeParams);
      }
    },
    [apiRef, logger, dragRowId],
  );

  const handleDragEnd = React.useCallback<GridEventListener<GridEvents.rowDragEnd>>(
    (params, event): void => {
      if (isRowReorderDisabled || (!dragRowId && dragRowId !== 0)) {
        return;
      }

      logger.debug('End dragging row');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);
      dragRowNode.current = null;

      // Check if the row was dropped outside the grid.
      if (event.dataTransfer.dropEffect === 'none') {
        // Accessing params.field may contain the wrong field as header elements are reused
        apiRef.current.setRowIndex(dragRowId, originRowIndex.current!);

        const rowOrderChangeParams: GridRowOrderChangeParams = {
          row: apiRef.current.getRow(dragRowId),
          targetIndex: originRowIndex.current!,
          oldIndex: originRowIndex.current!,
        };
        apiRef.current.publishEvent(GridEvents.rowOrderChange, rowOrderChangeParams);

        originRowIndex.current = null;
      }

      setDragRowId('');
    },
    [isRowReorderDisabled, logger, apiRef, dragRowId],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowDragStart, handleDragStart);
  useGridApiEventHandler(apiRef, GridEvents.rowDragOver, handleDragOver);
  useGridApiEventHandler(apiRef, GridEvents.rowDragEnd, handleDragEnd);
  useGridApiEventHandler(apiRef, GridEvents.cellDragOver, handleDragOver);
  useGridApiOptionHandler(apiRef, GridEvents.rowOrderChange, props.onRowOrderChange);
};
