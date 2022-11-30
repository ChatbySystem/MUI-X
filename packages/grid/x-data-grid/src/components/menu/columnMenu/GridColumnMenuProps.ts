import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnMenuRootProps } from '../../../hooks/features/columnMenu';

export interface GridColumnMenuContainerProps extends React.HTMLAttributes<HTMLUListElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  colDef: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
  MenuListComponent?: React.JSXElementConstructor<any>;
}

export interface GridColumnMenuProps
  extends Partial<GridColumnMenuRootProps>,
    Omit<GridColumnMenuContainerProps, 'MenuListComponent'> {}
