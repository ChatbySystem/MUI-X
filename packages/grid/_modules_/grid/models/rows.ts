import { GridOptions } from './gridOptions'

export type RowsProp = RowData[];
export type Rows = RowModel[];

/**
 * The key value object representing the data of a row.
 */
export interface RowData extends ObjectWithId {
  [key: string]: any;
}

/**
 * The type of Id supported by the grid.
 */
export type RowId = string | number;

/**
 * The cell value type.
 */
export type CellValue = string | number | boolean | Date | null | undefined | object;

/**
 * The coordinates of cell represented by their row and column indexes.
 */
export interface CellIndexCoordinates {
  colIndex: number;
  rowIndex: number;
}
export interface ObjectWithId {
  id?: RowId;
}

/**
 * The internal model of a row containing its state and data.
 */
export interface RowModel {
  id: RowId;
  data: RowData;
  selected: boolean;
}

/**
 * An helper function allowing to create [[RowModel]] from [[RowData]].
 *
 * @param rowData Row as [[RowData]].
 * @param rowIdAccessor RowId as [[RowId]].
 * @returns A row as [[RowModel]].
 */
export function createRowModel(rowData: RowData, gridOptions: GridOptions ): RowModel {
  // if (rowData.id == null) {
  if (!rowData.id && !gridOptions.rowIdAccessor) {
    throw new Error(
      [
        'Material-UI: The data grid component requires all rows to have a unique id property,',
        'or use "rowIdAccessor" api of GridComponent to specify your row id key.',
        'A row was provided without in the rows prop:',
        JSON.stringify(rowData),
      ].join('\n'),
    );
  }

  const row: RowModel = {
    id: gridOptions.rowIdAccessor ? rowData[gridOptions.rowIdAccessor] : rowData.id,
    data: rowData,
    selected: false,
  };
  return row;
}
