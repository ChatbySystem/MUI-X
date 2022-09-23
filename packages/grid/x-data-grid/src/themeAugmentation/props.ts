import { ComponentsOverrides, ComponentsProps, Theme } from '@mui/material/styles';
import { DataGridProps } from '../models/props/DataGridProps';

export interface DataGridComponentsPropsList {
  MuiDataGrid: DataGridProps;
}

export interface DataGridComponents {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DataGridComponents {}
}
