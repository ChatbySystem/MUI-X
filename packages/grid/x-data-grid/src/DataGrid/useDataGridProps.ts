import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DataGridProcessedProps,
  DataGridProps,
  DataGridForcedPropsKey,
  DataGridPropsWithDefaultValues,
} from '../models/props/DataGridProps';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants';
import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '../constants/defaultGridSlotsComponents';
import { GridEditModes, UncapitalizedGridSlotsComponent, GridValidRowModel } from '../models';
import { uncapitalizeObjectKeys } from '../internals/slotsMigration';

const DATA_GRID_FORCED_PROPS: { [key in DataGridForcedPropsKey]?: DataGridProcessedProps[key] } = {
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleRowSelection: true,
  throttleRowsMs: undefined,
  hideFooterRowCount: false,
  pagination: true,
  checkboxSelectionVisibleOnly: false,
  disableColumnReorder: true,
  disableColumnResize: true,
  keepColumnPositionIfDraggedOutside: false,
  signature: 'DataGrid',
};

/**
 * The default values of `DataGridPropsWithDefaultValues` to inject in the props of DataGrid.
 */
export const DATA_GRID_PROPS_DEFAULT_VALUES: DataGridPropsWithDefaultValues = {
  autoHeight: false,
  autoPageSize: false,
  checkboxSelection: false,
  checkboxSelectionVisibleOnly: false,
  columnBuffer: 3,
  rowBuffer: 3,
  columnThreshold: 3,
  rowThreshold: 3,
  rowSelection: true,
  density: 'standard',
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableMultipleColumnsFiltering: false,
  disableMultipleRowSelection: false,
  disableMultipleColumnsSorting: false,
  disableRowSelectionOnClick: false,
  disableVirtualization: false,
  editMode: GridEditModes.Cell,
  filterMode: 'client',
  columnHeaderHeight: 56,
  hideFooter: false,
  hideFooterPagination: false,
  hideFooterRowCount: false,
  hideFooterSelectedRowCount: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? ('error' as const) : ('warn' as const),
  pagination: false,
  paginationMode: 'client',
  rowHeight: 52,
  pageSizeOptions: [25, 50, 100],
  rowSpacingType: 'margin',
  showCellVerticalBorder: false,
  showColumnVerticalBorder: false,
  sortingOrder: ['asc' as const, 'desc' as const, null],
  sortingMode: 'client',
  throttleRowsMs: 0,
  disableColumnReorder: false,
  disableColumnResize: false,
  keepNonExistentRowsSelected: false,
  keepColumnPositionIfDraggedOutside: false,
};

export const useDataGridProps = <R extends GridValidRowModel>(inProps: DataGridProps<R>) => {
  const { componentsProps, ...themedProps } = useThemeProps({
    props: inProps,
    name: 'MuiDataGrid',
  });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<UncapitalizedGridSlotsComponent>(() => {
    const uncapitalizedDefaultSlots = uncapitalizeObjectKeys(DATA_GRID_DEFAULT_SLOTS_COMPONENTS)!;
    const overrides =
      themedProps.slots ?? themedProps.components
        ? uncapitalizeObjectKeys(themedProps.components)
        : null;

    if (!overrides) {
      return { ...uncapitalizedDefaultSlots };
    }

    type GridSlot = keyof UncapitalizedGridSlotsComponent;
    return Object.entries(uncapitalizedDefaultSlots).reduce((acc, [key, defaultComponent]) => {
      const override = overrides[key as GridSlot];
      const component = override !== undefined ? override : defaultComponent;
      return { ...acc, [key as GridSlot]: component };
    }, {} as UncapitalizedGridSlotsComponent);
  }, [themedProps.components, themedProps.slots]);

  return React.useMemo<DataGridProcessedProps<R>>(
    () => ({
      ...DATA_GRID_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      slots,
      slotProps: themedProps.slotProps ?? componentsProps,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [themedProps, localeText, slots, componentsProps],
  );
};
