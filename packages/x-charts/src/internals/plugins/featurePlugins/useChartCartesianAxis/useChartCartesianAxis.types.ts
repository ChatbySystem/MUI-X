import { MakeOptional } from '@mui/x-internals/types';
import { ChartPluginSignature } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
  AxisConfig,
} from '../../../../models/axis';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export type DefaultizedAxisConfig<AxisProps> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, AxisProps>;
};

export type CartesianContextState = {
  /**
   * Mapping from x-axis key to scaling configuration.
   */
  xAxis: DefaultizedAxisConfig<ChartsXAxisProps>;
  /**
   * Mapping from y-axis key to scaling configuration.
   */
  yAxis: DefaultizedAxisConfig<ChartsYAxisProps>;
  /**
   * The x-axes IDs sorted by order they got provided.
   */
  xAxisIds: AxisId[];
  /**
   * The y-axes IDs sorted by order they got provided.
   */
  yAxisIds: AxisId[];
};

// export type ZoomData = { axisId: AxisId; start: number; end: number };

// export type ZoomFilterMode = 'keep' | 'discard' | 'empty';
// export type ZoomOptions = Record<AxisId, { filterMode: ZoomFilterMode }>;

// export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

// export type GetZoomAxisFilters = (params: {
//   currentAxisId: AxisId | undefined;
//   seriesXAxisId?: AxisId;
//   seriesYAxisId?: AxisId;
//   isDefaultAxis: boolean;
// }) => ExtremumFilter;

export interface UseChartCartesianAxisParameters {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[];
  dataset?: DatasetType;
}

export type UseChartCartesianAxisDefaultizedParameters = UseChartCartesianAxisParameters & {};

export interface UseChartCartesianAxisState {
  cartesianAxis: {
    x: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
    y: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
  };
}

export type ExtremumFilter = (
  value: { x: number | Date | string | null; y: number | Date | string | null },
  dataIndex: number,
) => boolean;

export interface UseChartCartesianAxisInstance {}

export type UseChartCartesianAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartCartesianAxisParameters;
    defaultizedParams: UseChartCartesianAxisDefaultizedParameters;
    state: UseChartCartesianAxisState;
    // instance: UseChartCartesianAxisInstance;
    dependencies: [UseChartSeriesSignature<SeriesType>];
  }>;

export type ZoomData = { axisId: AxisId; start: number; end: number };

export type ZoomFilterMode = 'keep' | 'discard' | 'empty';
export type ZoomOptions = Record<AxisId, { filterMode: ZoomFilterMode }>;

export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

export type GetZoomAxisFilters = (params: {
  currentAxisId: AxisId | undefined;
  seriesXAxisId?: AxisId;
  seriesYAxisId?: AxisId;
  isDefaultAxis: boolean;
}) => ExtremumFilter;
