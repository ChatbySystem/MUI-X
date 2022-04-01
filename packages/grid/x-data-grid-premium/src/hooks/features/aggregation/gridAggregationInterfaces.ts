import { GridValueFormatterParams, GridRowId } from '@mui/x-data-grid-pro';

interface GridAggregationParams<V = any> {
  values: V[];
}

export type GridAggregationFunction<V = any, AV = V, F = V> = {
  /**
   * Function that takes the current cell values and generates the aggregated value.
   * @template V, AV
   * @param {GridAggregationParams<V>} params The params of the current aggregated cell.
   * @returns {AV} The aggregated value.
   */
  apply: (params: GridAggregationParams<V>) => AV | null;

  /**
   * Column types supported by this aggregation function.
   * If not defined, all types are supported (in most cases this property should be defined).
   */
  types?: string[];

  /**
   * Function that allows to apply a formatter to the aggregated value.
   * If not defined, the grid will use the formatter of the column.
   * @template AV, F
   * @param {GridValueFormatterParams<AV>} params Object containing parameters for the formatter.
   * @returns {F} The formatted value.
   */
  valueFormatter?: (params: GridValueFormatterParams<AV>) => F;

  /**
   * Indicates if the aggregated value have the same unit as the cells used to generate it.
   * It can be used to apply a custom cell renderer only if the aggregated value has the same unit.
   * @default `true`
   */
  hasCellUnit?: boolean;
};

export type GridAggregationModel = Record<string, string>;

export type GridAggregationLookup = {
  [rowId: GridRowId]: {
    [field: string]: any;
  };
};

export interface GridAggregationState {
  model: GridAggregationModel;
  lookup: GridAggregationLookup;
}
export interface GridAggregationInitialState {
  model?: GridAggregationModel;
}

export interface GridAggregationApi {
  /**
   * Sets the aggregation rules.
   * @param {GridAggregationModel} model The aggregated columns.
   */
  setAggregationModel: (model: GridAggregationModel) => void;
}

export type GridAggregationPosition = 'inline' | 'footer';

export interface GridAggregationCellMeta {
  /**
   * If `true`, the current aggregated value has the same unit as the value of the other cells of this row.
   * For instance, "min" / "max" aggregation have the same unit as the other cells.
   * If `false`, the current aggregated value has another unit or not unit.
   * For instance, "size" aggregation has no unit.
   */
  hasCellUnit: boolean;
  item: string;
}
