import * as React from 'react';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import { GridInternalApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStatePersistenceApi } from './gridStatePersistenceInterface';
import { useGridApiMethod } from '../../utils';

export const useGridStatePersistence = (
  apiRef: React.MutableRefObject<GridInternalApiCommunity>,
) => {
  const exportState = React.useCallback<
    GridStatePersistenceApi<GridInitialStateCommunity>['exportState']
  >(() => {
    const stateToExport = apiRef.current.applyPipeProcessors('exportState', {});

    return stateToExport as GridInitialStateCommunity;
  }, [apiRef]);

  const restoreState = React.useCallback<
    GridStatePersistenceApi<GridInitialStateCommunity>['restoreState']
  >(
    (stateToRestore) => {
      const response = apiRef.current.applyPipeProcessors(
        'restoreState',
        {
          callbacks: [],
        },
        {
          stateToRestore,
        },
      );

      response.callbacks.forEach((callback) => {
        callback();
      });

      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const statePersistenceApi: GridStatePersistenceApi<GridInitialStateCommunity> = {
    exportState,
    restoreState,
  };

  useGridApiMethod(apiRef, statePersistenceApi, 'GridStatePersistenceApi');
};
