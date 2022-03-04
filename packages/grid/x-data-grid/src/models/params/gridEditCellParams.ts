import { GridCellValue } from '../gridCell';
import { GridEditCellProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from './gridCellParams';

// TODO v6 - remove
export interface GridEditCellPropsParams {
  id: GridRowId;
  field: string;
  props: GridEditCellProps;
}

/**
 * Params passed to `apiRef.current.setEditCellValue`.
 */
export interface GridEditCellValueParams {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The field.
   */
  field: string;
  /**
   * The new value for the cell.
   */
  value: GridCellValue;
  /**
   * The debounce time in milliseconds.
   */
  debounceMs?: number;
}

// TODO v6 - remove
export interface GridCommitCellChangeParams {
  id: GridRowId;
  field: string;
}

// TODO v6 - remove
export interface GridCellEditCommitParams {
  id: GridRowId;
  field: string;
  value: GridCellValue;
}

export enum GridCellEditStartReasons {
  enterKeyDown = 'enterKeyDown',
  cellDoubleClick = 'cellDoubleClick',
  printableKeyDown = 'printableKeyDown',
  deleteKeyDown = 'deleteKeyDown',
}

/**
 * Params passed to the `cellEditStart` event.
 */
export interface GridCellEditStartParams<V = any, R = any, F = V> extends GridCellParams<V, R, F> {
  /**
   * The reason for this event to be triggered.
   */
  reason: GridCellEditStartReasons;
}

export enum GridCellEditStopReasons {
  cellFocusOut = 'cellFocusOut',
  escapeKeyDown = 'escapeKeyDown',
  enterKeyDown = 'enterKeyDown',
}

/**
 * Params passed to the `cellEditStop event.
 */
export interface GridCellEditStopParams<V = any, R = any, F = V> extends GridCellParams<V, R, F> {
  /**
   * The reason for this event to be triggered.
   */
  reason: GridCellEditStopReasons;
}
