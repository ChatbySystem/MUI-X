import { GridRowId } from '../gridRows';

/**
 * The Row Meta API interface that is available in the grid `apiRef`.
 */
export interface GridRowsMetaApi {
  /**
   * Gets target row height.
   * @param {GridRowId} id The id of the row.
   * @returns {number} The target row height.
   * @ignore - do not document.
   */
  unstable_getRowHeight: (id: GridRowId) => number;
  /**
   * Updates the height of a row.
   * @param {GridRowId} id The id of the row.
   * @param {number} height The new height.
   * @ignore - do not document.
   */
  unstable_setRowHeight: (id: GridRowId, height: number) => void;
}
