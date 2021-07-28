import * as React from 'react';
import { DATA_GRID_PROPTYPES } from './DataGridPropTypes';
import {
  DEFAULT_GRID_OPTIONS,
  GridBody,
  GridComponentProps,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';

const DATA_GRID_FORCED_PROPS: Omit<
  GridComponentProps,
  Exclude<keyof DataGridProps, 'pagination'>
> = {
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
};

const DataGridRaw = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  inProps,
  ref,
) {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const props = React.useMemo<GridComponentProps>(
    () => ({
      ...inProps,
      ...DATA_GRID_FORCED_PROPS,
    }),
    [inProps],
  );

  const apiRef = useGridApiRef();

  useDataGridComponent(apiRef, props);

  return (
    <GridContextProvider apiRef={apiRef} props={props}>
      <GridRoot ref={ref}>
        <GridErrorHandler>
          <GridHeaderPlaceholder />
          <GridBody />
          <GridFooterPlaceholder />
        </GridErrorHandler>
      </GridRoot>
    </GridContextProvider>
  );
});

DataGridRaw.defaultProps = DEFAULT_GRID_OPTIONS;

export const DataGrid = React.memo(DataGridRaw);

// @ts-ignore
DataGrid.propTypes = DATA_GRID_PROPTYPES;
