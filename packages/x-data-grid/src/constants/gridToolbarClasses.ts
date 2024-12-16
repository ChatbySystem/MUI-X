import {
  unstable_generateUtilityClasses as generateUtilityClasses,
  unstable_generateUtilityClass as generateUtilityClass,
} from '@mui/utils';

export interface GridToolbarClasses {
  /**
   * Styles applied to the toolbar root element.
   */
  root: string;
  /**
   * Styles applied to the toolbar button element.
   */
  button: string;
  /**
   * Styles applied to the toolbar separator element.
   */
  separator: string;
  /**
   * Styles applied to the toolbar toggle button element.
   */
  toggleButton: string;
  /**
   * Styles applied to the toolbar toggle button group element.
   */
  toggleButtonGroup: string;
}

export type GridToolbarClassKey = keyof GridToolbarClasses;

export function getDataGridToolbarUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataGridToolbar', slot);
}

export const gridToolbarClasses = generateUtilityClasses<GridToolbarClassKey>(
  'MuiDataGridToolbar',
  ['root', 'button', 'separator', 'toggleButton', 'toggleButtonGroup'],
);
