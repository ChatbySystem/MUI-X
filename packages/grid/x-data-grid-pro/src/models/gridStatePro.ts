import {
  GridInitialState as GridInitialStateCommunity,
  GridState as GridStateCommunity,
} from '@mui/x-data-grid';
import type {
  GridRowGroupingState,
  GridDetailPanelState,
  GridDetailPanelInitialState,
  GridColumnReorderState,
  GridColumnResizeState,
  GridColumnPinningState,
  GridRowGroupingInitialState,
  GridAggregationState,
  GridAggregationInitialState,
} from '../hooks';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  rowGrouping: GridRowGroupingState;
  detailPanel: GridDetailPanelState;
  aggregation: GridAggregationState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
  detailPanel?: GridDetailPanelInitialState;
  aggregation?: GridAggregationInitialState;
}
