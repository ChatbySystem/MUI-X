export type GridRowsProp = Readonly<GridRowData[]>;
export type GridRowDefaultData = { [key: string]: any };
export type GridRowData<RowType extends GridRowDefaultData = GridRowDefaultData> = RowType;

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel<RowType extends GridRowDefaultData = GridRowDefaultData> =
  GridRowData<RowType>;

export type GridUpdateAction = 'delete';

export interface GridRowModelUpdate extends GridRowData {
  _action?: GridUpdateAction;
}

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number;

/**
 * The function to retrieve the id of a [[GridRowData]].
 */
export type GridRowIdGetter = (row: GridRowData) => GridRowId;

/**
 * An helper function to check if the id provided is valid.
 *
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowData]].
 * @returns a boolean
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage?: string,
): boolean {
  if (id == null) {
    throw new Error(
      [
        'Material-UI: The data grid component requires all rows to have a unique id property.',
        detailErrorMessage || 'A row was provided without id in the rows prop:',
        JSON.stringify(row),
      ].join('\n'),
    );
  }

  return true;
}
