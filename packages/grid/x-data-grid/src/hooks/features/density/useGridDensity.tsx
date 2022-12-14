import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridDensityState } from './densityState';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

// TODO v6: revise keeping headerHeight and rowHeight in state
const getUpdatedDensityState = (
  newDensity: GridDensity,
  newHeaderHeight: number,
  newRowHeight: number,
): GridDensityState => {
  switch (newDensity) {
    case GridDensityTypes.Compact:
      return {
        value: newDensity,
        headerHeight: Math.floor(newHeaderHeight * COMPACT_DENSITY_FACTOR),
        rowHeight: Math.floor(newRowHeight * COMPACT_DENSITY_FACTOR),
        factor: COMPACT_DENSITY_FACTOR,
      };
    case GridDensityTypes.Comfortable:
      return {
        value: newDensity,
        headerHeight: Math.floor(newHeaderHeight * COMFORTABLE_DENSITY_FACTOR),
        rowHeight: Math.floor(newRowHeight * COMFORTABLE_DENSITY_FACTOR),
        factor: COMFORTABLE_DENSITY_FACTOR,
      };
    default:
      return {
        value: newDensity,
        headerHeight: newHeaderHeight,
        rowHeight: newRowHeight,
        factor: 1,
      };
  }
};

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'density' | 'columnHeaderHeight' | 'rowHeight'>
> = (state, props) => ({
  ...state,
  density: getUpdatedDensityState(props.density, props.columnHeaderHeight, props.rowHeight),
});

export const useGridDensity = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'columnHeaderHeight' | 'rowHeight' | 'density'>,
): void => {
  const logger = useGridLogger(apiRef, 'useDensity');

  const setDensity = React.useCallback<GridDensityApi['setDensity']>(
    (
      newDensity,
      newHeaderHeight = props.columnHeaderHeight,
      newRowHeight = props.rowHeight,
    ): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      apiRef.current.setState((state) => {
        const currentDensityState = gridDensitySelector(state);
        const newDensityState = getUpdatedDensityState(newDensity, newHeaderHeight, newRowHeight);

        if (isDeepEqual(currentDensityState, newDensityState)) {
          return state;
        }

        return {
          ...state,
          density: newDensityState,
        };
      });
      apiRef.current.forceUpdate();
    },
    [logger, apiRef, props.columnHeaderHeight, props.rowHeight],
  );

  React.useEffect(() => {
    apiRef.current.setDensity(props.density, props.columnHeaderHeight, props.rowHeight);
  }, [apiRef, props.density, props.rowHeight, props.columnHeaderHeight]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'public');
};
