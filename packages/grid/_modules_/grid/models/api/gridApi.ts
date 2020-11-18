import { ColumnMenuApi } from './columnMenuApi';
import { FilterApi } from './filterApi';
import { PreferencesPanelApi } from './preferencesPanelApi';
import { RowApi } from './rowApi';
import { ColumnApi } from './columnApi';
import { ColumnReorderApi } from './columnReorderApi';
import { SelectionApi } from './selectionApi';
import { SortApi } from './sortApi';
import { PaginationApi } from './paginationApi';
import { StateApi } from './stateApi';
import { VirtualizationApi } from './virtualizationApi';
import { CoreApi } from './coreApi';
import { EventsApi } from './eventsApi';

/**
 * The full grid API.
 */
export type GridApi = CoreApi &
  StateApi &
  EventsApi &
  RowApi &
  ColumnApi &
  ColumnReorderApi &
  SelectionApi &
  SortApi &
  VirtualizationApi &
  PaginationApi &
  FilterApi &
	ColumnMenuApi &
	PreferencesPanelApi;
