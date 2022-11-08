import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid-pro';
import { GridPremiumSlotsComponent, GridPremiumIconSlotsComponent } from '../models';
import {
  GridWorkspacesIcon,
  GridGroupWorkIcon,
  GridColumnMenuAggregationItem,
} from '../components';
import { GridColumnMenuRowUngroupItem } from '../components/GridColumnMenuRowUngroupItem';
import { GridColumnMenuRowGroupItem } from '../components/GridColumnMenuRowGroupItem';

export const DEFAULT_GRID_PREMIUM_ICON_SLOTS_COMPONENTS: GridPremiumIconSlotsComponent = {
  ColumnMenuUngroupIcon: GridWorkspacesIcon,
  ColumnMenuGroupIcon: GridGroupWorkIcon,
};

export const DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS: GridPremiumSlotsComponent = {
  ...DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  ...DEFAULT_GRID_PREMIUM_ICON_SLOTS_COMPONENTS,
  ColumnMenuAggregationItem: GridColumnMenuAggregationItem,
  ColumnMenuRowGroupItem: GridColumnMenuRowGroupItem,
  ColumnMenuRowUngroupItem: GridColumnMenuRowUngroupItem,
};
