import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { isNumber } from '../../../utils/utils';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPaginationRowCountApi, GridPaginationState } from './gridPaginationInterfaces';
import { gridFilteredTopLevelRowCountSelector } from '../filter';
import {
  useGridLogger,
  useGridSelector,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import {
  gridPaginationRowCountSelector,
  gridPaginationMetaSelector,
  gridPaginationModelSelector,
} from './gridPaginationSelector';
import { noRowCountInServerMode } from './gridPaginationUtils';

export const useGridRowCount = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    'rowCount' | 'initialState' | 'paginationMode' | 'onRowCountChange'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridRowCount');

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const rowCountState = useGridSelector(apiRef, gridPaginationRowCountSelector);
  const paginationMeta = useGridSelector(apiRef, gridPaginationMetaSelector);
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const previousPageSize = useLazyRef(() => gridPaginationModelSelector(apiRef).pageSize);

  apiRef.current.registerControlState({
    stateId: 'paginationRowCount',
    propModel: props.rowCount,
    propOnChange: props.onRowCountChange,
    stateSelector: gridPaginationRowCountSelector,
    changeEvent: 'rowCountChange',
  });

  /**
   * API METHODS
   */
  const setRowCount = React.useCallback<GridPaginationRowCountApi['setRowCount']>(
    (newRowCount) => {
      if (rowCountState === newRowCount) {
        return;
      }
      logger.debug("Setting 'rowCount' to", newRowCount);

      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          rowCount: newRowCount,
        },
      }));
    },
    [apiRef, logger, rowCountState],
  );

  const paginationRowCountApi: GridPaginationRowCountApi = {
    setRowCount,
  };

  useGridApiMethod(apiRef, paginationRowCountApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const exportedRowCount = gridPaginationRowCountSelector(apiRef);

      const shouldExportRowCount =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the `rowCount` is controlled
        props.rowCount != null ||
        // Always export if the `rowCount` has been initialized
        props.initialState?.pagination?.rowCount != null;

      if (!shouldExportRowCount) {
        return prevState;
      }

      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          rowCount: exportedRowCount,
        },
      };
    },
    [apiRef, props.rowCount, props.initialState?.pagination?.rowCount],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const restoredRowCount = context.stateToRestore.pagination?.rowCount
        ? context.stateToRestore.pagination.rowCount
        : gridPaginationRowCountSelector(apiRef);
      apiRef.current.setState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          rowCount: restoredRowCount,
        },
      }));
      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePaginationMetaChange = React.useCallback(
    (meta: GridPaginationState['meta']) => {
      if (props.paginationMode === 'client') {
        return;
      }
      if (meta.hasNextPage === false && rowCountState === -1) {
        apiRef.current.setRowCount(paginationModel.pageSize * (paginationModel.page + 1));
        return;
      }

      if (meta.hasNextPage === true && rowCountState !== -1) {
        const lastPage = Math.max(0, Math.ceil(rowCountState / paginationModel.pageSize) - 1);
        if (paginationModel.page === lastPage) {
          apiRef.current.setRowCount(-1);
        }
      }
    },
    [apiRef, props.paginationMode, rowCountState, paginationModel],
  );

  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationState['paginationModel']) => {
      if (props.paginationMode === 'client' || !previousPageSize.current) {
        return;
      }
      if (model.pageSize !== previousPageSize.current) {
        // The page size has changed
        previousPageSize.current = model.pageSize;
        if (rowCountState !== -1) {
          // Row count unknown and page size changed, reset the page
          apiRef.current.setPage(0);
          return;
        }
        const lastPage = Math.max(0, Math.ceil(rowCountState / model.pageSize) - 1);
        if (model.page > lastPage) {
          apiRef.current.setPage(lastPage);
        }
      }
    },
    [props.paginationMode, previousPageSize, rowCountState, apiRef],
  );

  useGridApiEventHandler(apiRef, 'paginationModelChange', handlePaginationModelChange);
  useGridApiEventHandler(apiRef, 'paginationMetaChange', handlePaginationMetaChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (props.paginationMode === 'server' && props.rowCount == null) {
        noRowCountInServerMode();
      }
    }
  }, [props.rowCount, props.paginationMode]);

  React.useEffect(() => {
    if (props.paginationMode === 'client') {
      apiRef.current.setRowCount(visibleTopLevelRowCount);
      return;
    }

    if (isNumber(props.rowCount)) {
      apiRef.current.setRowCount(props.rowCount);
    }
  }, [
    apiRef,
    visibleTopLevelRowCount,
    props.paginationMode,
    props.rowCount,
    paginationMeta,
    paginationModel,
  ]);
};
