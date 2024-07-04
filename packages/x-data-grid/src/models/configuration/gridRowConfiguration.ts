import { GridRowId } from '../gridRows';

/**
 * Get the ARIA attributes for a row
 * @param {GridRowId} rowId The id of the row
 * @param {number} index The position index of the row
 * @returns {Record<string, string | number | boolean>} The ARIA attributes
 */
type GetAriaAttributesFn = (
  rowId: GridRowId,
  index: number,
) => Record<string, string | number | boolean>;

export type GridRowInternalHook = () => GetAriaAttributesFn;
