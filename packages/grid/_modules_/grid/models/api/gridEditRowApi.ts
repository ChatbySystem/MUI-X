import { GridCellMode } from '../gridCell';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridEditCellPropsParams, GridCommitCellChangeParams } from '../params/gridEditCellParams';

/**
 * The editing API interface that is available in the grid `apiRef`.
 */
export interface GridEditRowApi {
  /**
   * Set sthe edit rows model of the grid.
   * @param {GridEditRowsModel} model The new edit rows model.
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Gets the edit rows model of the grid.
   * @returns {GridEditRowsModel} The edit rows model.
   */
  getEditRowsModel: () => GridEditRowsModel;
  /**
   * Sets the mode of a cell.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The field to change the mode.
   * @param {GridCellMode} mode Can be: `"edit"`, `"view"`.
   */
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Gets the mode of a cell.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The field to get the mode.
   * @returns Returns `"edit"` or `"view"`.
   */
  getCellMode: (id: GridRowId, field: string) => GridCellMode;
  /**
   * Controls if a cell is editable.
   * @param {GridCellParams} params The cell params.
   * @returns {boolean} A boolean value determining if the cell is editable.
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Sets the input props of the edit cell.
   * @param {GridEditCellPropsParams} params The params to set.
   */
  setEditCellProps: (params: GridEditCellPropsParams) => void;
  /**
   * Sets the input props of the edit cell and call `onEditCellChange` after the change.
   * @param {GridEditCellPropsParams} params The params to set.
   * @param {React.SyntheticEvent} event The event to pass forward.
   */
  changeCellEditProps: (params: GridEditCellPropsParams, event: React.SyntheticEvent) => void;
  /**
   * Gets the params to be passed when calling `setEditCellProps` or `changeCellEditProps`.
   * @param {GridRowId} rowId The id of the row.
   * @param {string} field The column field.
   * @returns {GridEditCellPropsParams} The params.
   */
  getEditCellPropsParams: (rowId: GridRowId, field: string) => GridEditCellPropsParams;
  /**
   * Updates the field at the given id with the value stored in the edit row model.
   * @param {GridCommitCellChangeParams} params The id and field to commit to.
   * @param {React.SyntheticEvent} event The event to pass forward.
   * @returns {boolean} A boolean indicating if there is an error.
   */
  commitCellChange: (params: GridCommitCellChangeParams, event?: React.SyntheticEvent) => boolean;
}
