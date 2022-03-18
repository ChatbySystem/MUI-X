import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  GRID_DEFAULT_LOCALE_TEXT,
  GridSlotsComponent,
  DATA_GRID_PROPS_DEFAULT_VALUES,
} from '@mui/x-data-grid';
import {
  DataGridProProps,
  DataGridProProcessedProps,
  DataGridProPropsWithDefaultValue,
} from '../models/dataGridProProps';

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  disableColumnPinning: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  getDetailPanelHeight: () => 500,
};

export const useDataGridProProps = (inProps: DataGridProProps) => {
  const themedProps = useThemeProps({ props: inProps, name: 'MuiDataGrid' });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const components = React.useMemo<GridSlotsComponent>(() => {
    const overrides = themedProps.components;

    if (!overrides) {
      return { ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS };
    }

    const mergedComponents = {} as GridSlotsComponent;

    type GridSlots = keyof GridSlotsComponent;
    Object.entries(DATA_GRID_DEFAULT_SLOTS_COMPONENTS).forEach(([key, defaultComponent]) => {
      mergedComponents[key as GridSlots] =
        overrides[key as GridSlots] === undefined ? defaultComponent : overrides[key as GridSlots];
    });

    return mergedComponents;
  }, [themedProps.components]);

  return React.useMemo<DataGridProProcessedProps>(
    () => ({
      ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      components,
      signature: 'DataGridPro',
    }),
    [themedProps, localeText, components],
  );
};
