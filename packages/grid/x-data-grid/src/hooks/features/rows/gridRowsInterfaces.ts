import { GridRowId, GridRowsLookup, GridRowTreeConfig } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export interface GridRowsLookups {
  dataRowIdToModelLookup: GridRowsLookup;
  dataRowIdToIdLookup: Record<string, GridRowId>;
  autoGeneratedRowIdToIdLookup: Record<string, GridRowId>;
}

export interface GridRowTreeCreationParams extends GridRowsLookups {
  previousTree: GridRowTreeConfig | null;
  previousTreeDepth: number | null;
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
}

export interface GridRowTreeCreationValue {
  /**
   * Name of the algorithm used to group the rows
   * It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance.
   */
  groupingName: string;
  tree: GridRowTreeConfig;
  treeDepth: number;
  autoGeneratedRowIdToIdLookup: Record<string, GridRowId>;
  dataRowIds: GridRowId[];
}

export interface GridRowsInternalCache extends GridRowsLookups {
  updates: GridRowsPartialUpdates | GridRowsFullUpdate;
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: DataGridProcessedProps['rows'];
  /**
   * The value of the `loading` prop since the last time that the rows state was updated.
   */
  loadingPropBeforePartialUpdates: DataGridProcessedProps['loading'];
}

export interface GridRowsState extends GridRowTreeCreationValue, GridRowsLookups {
  /**
   * Matches the value of the `loading` prop.
   */
  loading?: boolean;
  /**
   * Amount of rows before applying the filtering.
   * It also counts the expanded and collapsed children rows.
   */
  totalRowCount: number;
  /**
   * Amount of rows before applying the filtering.
   * It does not count the expanded children rows.
   */
  totalTopLevelRowCount: number;
  /**
   * Tree returned by the `rowTreeCreation` strategy processor.
   * It is used to re-apply the `hydrateRows` pipe processor without having to recreate the tree.
   */
  groupingResponseBeforeRowHydration: GridRowTreeCreationValue;
}

export type GridHydrateRowsValue = GridRowTreeCreationValue;

export type GridRowsPartialUpdateAction = 'insert' | 'modify' | 'remove';

export interface GridRowsFullUpdate {
  type: 'full';
  rows: GridRowId[];
}

export interface GridRowsPartialUpdates {
  type: 'partial';
  actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
  idToActionLookup: { [id: GridRowId]: GridRowsPartialUpdateAction | undefined };
}
