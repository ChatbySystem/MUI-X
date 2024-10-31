import {
  ScatterSeriesType,
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import {
  PieSeriesType,
  DefaultizedPieSeriesType,
  PieItemIdentifier,
  PieValueType,
  DefaultizedPieValueType,
} from './pie';
import { DefaultizedProps, MakeOptional } from '../helpers';
import {
  DefaultizedFunnelSeriesType,
  FunnelItemIdentifier,
  FunnelSeriesType,
} from '../../FunnelChart/funnel.types';

export interface ChartsSeriesConfig {
  bar: {
    /**
     * Series type when passed to the formatter (some ids are given default values to simplify the DX)
     */
    seriesInput: DefaultizedProps<BarSeriesType, 'id'> & { color: string };
    /**
     * Series type when stored in the context (with all the preprocessing added))
     */
    series: DefaultizedBarSeriesType;
    /**
     * Series typing such that the one user need to provide
     */
    seriesProp: BarSeriesType;
    itemIdentifier: BarItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    cartesian: true;
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> & { color: string };
    series: DefaultizedLineSeriesType;
    seriesProp: LineSeriesType;
    itemIdentifier: LineItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    cartesian: true;
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> & { color: string };
    series: DefaultizedScatterSeriesType;
    seriesProp: ScatterSeriesType;
    valueType: ScatterValueType;
    itemIdentifier: ScatterItemIdentifier;
    cartesian: true;
  };
  pie: {
    seriesInput: Omit<DefaultizedProps<PieSeriesType, 'id'>, 'data'> & {
      data: (MakeOptional<PieValueType, 'id'> & { color: string })[];
    };
    series: DefaultizedPieSeriesType;
    seriesProp: PieSeriesType<MakeOptional<PieValueType, 'id'>>;
    itemIdentifier: PieItemIdentifier;
    valueType: DefaultizedPieValueType;
  };
  funnel: {
    seriesInput: DefaultizedProps<FunnelSeriesType, 'id'> & { color: string };
    series: DefaultizedFunnelSeriesType;
    seriesProp: FunnelSeriesType;
    itemIdentifier: FunnelItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    cartesian: true;
  };
}

export type ChartSeriesType = keyof ChartsSeriesConfig;

export type FunnelStackedData = Record<'x' | 'y', number> & Record<'useBandWidth', boolean>;

export type CartesianChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { cartesian: true } ? Key : never;
  }[ChartSeriesType]
>;

export type StackableChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { canBeStacked: true } ? Key : never;
  }[ChartSeriesType]
>;

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? T extends 'funnel'
    ? ChartsSeriesConfig[T]['seriesInput'] & {
        stackedData: FunnelStackedData[][];
      }
    : ChartsSeriesConfig[T]['seriesInput'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['seriesInput'];

export type ChartSeriesDefaultized<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? T extends 'funnel'
    ? ChartsSeriesConfig[T]['series'] & {
        stackedData: FunnelStackedData[][];
      }
    : ChartsSeriesConfig[T]['series'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['series'];

export type ChartItemIdentifier<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export type DatasetElementType<T> = {
  [key: string]: T;
};
export type DatasetType<T = number | string | Date | null | undefined> = DatasetElementType<T>[];
