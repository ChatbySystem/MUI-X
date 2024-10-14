import * as React from 'react';
import type { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridListColumnApi } from '../../../models/api/gridListColumnApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  gridListColumnSelector,
  gridVisibleListColumnDefinitionsSelector,
} from './gridListColumnsSelector';
import { gridColumnDefinitionsSelector } from '../columns';

export type GridListColumnState = GridStateColDef | undefined;

// TODO:
// - Calculate `computedWidth`

export const listColumnStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'unstable_listColumn'>
> = (state, props) => ({
  ...state,
  listColumn: { ...props.unstable_listColumn, computedWidth: 400 },
});

export function useGridListColumn(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_listColumn'>,
) {
  /**
   * API METHODS
   */

  const getListColumn = React.useCallback<GridListColumnApi['getListColumn']>(
    (field) => {
      const listColumn = gridListColumnSelector(apiRef.current.state);
      if (listColumn?.field === field) {
        return listColumn;
      }

      const columns = gridColumnDefinitionsSelector(apiRef);
      return columns.find((col) => col.field === field && col.type === 'actions');
    },
    [apiRef],
  );

  const getListColumnIndex = React.useCallback<GridListColumnApi['getListColumnIndex']>(
    (field) => {
      const columns = gridVisibleListColumnDefinitionsSelector(apiRef);
      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const listColumnApi: GridListColumnApi = {
    getListColumn,
    getListColumnIndex,
  };

  useGridApiMethod(apiRef, listColumnApi, 'private');

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_listColumn) {
      apiRef.current.setState((state) => ({
        ...state,
        // TODO: Populate with computedWidth
        listColumn: { ...props.unstable_listColumn, computedWidth: 400 } as GridListColumnState,
      }));
    }
  }, [apiRef, props.unstable_listColumn]);
}
