import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import {
  GridColumnMenuValue,
  GridColumnMenuKey,
  GetVisibleColumnMenuItemsArgs,
} from '../../../hooks/features/columnMenu';

export interface GridColumnMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  currentColumn: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
  /**
   * Default column menu items in order that needs to be shown
   * Could be overriden by `getVisibleColumnMenuItems`
   */
  defaultVisibleItems: Array<GridColumnMenuKey>;
  getVisibleColumnMenuItems?: (args: GetVisibleColumnMenuItemsArgs) => Array<GridColumnMenuKey>;
  /**
   * To override existing and add new items in column menu
   * If the item is already registered, it will be overwritten otherwise a new item will be registered
   */
  columnMenuItems?: GridColumnMenuValue['items'];
  defaultMenuItems: GridColumnMenuValue['items'];
}
