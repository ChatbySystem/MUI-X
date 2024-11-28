import {
  DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  generateDefaultSlots,
} from '@mui/x-data-grid/internals';
import type { GridProSlotsComponent , GridProIconSlotsComponent } from '../models';
import { GridProColumnMenu } from '../components/GridProColumnMenu';
import { GridColumnHeaders } from '../components/GridColumnHeaders';
import { GridHeaderFilterMenu } from '../components/headerFiltering/GridHeaderFilterMenu';
import { GridHeaderFilterCell } from '../components/headerFiltering/GridHeaderFilterCell';
import { GridDetailPanels } from '../components/GridDetailPanels';
import { GridPinnedRows } from '../components/GridPinnedRows';

const proSlots: Array<keyof GridProIconSlotsComponent> = [
  'columnMenuPinRightIcon',
  'columnMenuPinLeftIcon',
];

export const DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS: GridProSlotsComponent = {
  ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  ...generateDefaultSlots<keyof GridProIconSlotsComponent>(proSlots),
  columnMenu: GridProColumnMenu,
  columnHeaders: GridColumnHeaders,
  detailPanels: GridDetailPanels,
  headerFilterCell: GridHeaderFilterCell,
  headerFilterMenu: GridHeaderFilterMenu,
  pinnedRows: GridPinnedRows,
};
