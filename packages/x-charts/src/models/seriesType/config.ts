import { ScatterSeriesType, DefaultizedScatterSeriesType, ScatterItemIdentifier } from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { PieSeriesType, DefaultizedPieSeriesType, PieItemIdentifier, PieValueType } from './pie';
import { AxisConfig } from '../axis';
import { DefaultizedProps, MakeOptional } from '../helpers';
import { StackingGroupsType } from '../../internals/stackSeries';
import { SeriesId } from './common';

export interface ChartsSeriesConfig {
  bar: {
    /**
     * Series type when passed to the formatter (some ids are defaultised to simplify the DX)
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
    canBeStacked: true;
    cartesian: true;
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> & { color: string };
    series: DefaultizedLineSeriesType;
    seriesProp: LineSeriesType;
    itemIdentifier: LineItemIdentifier;
    canBeStacked: true;
    cartesian: true;
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> & { color: string };
    series: DefaultizedScatterSeriesType;
    seriesProp: ScatterSeriesType;
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
  };
}

export type ChartSeriesType = keyof ChartsSeriesConfig;

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
  ? ChartsSeriesConfig[T]['seriesInput'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['seriesInput'];

export type ChartSeriesDefaultized<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['series'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['series'];

export type ChartItemIdentifier<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeries<T>>;
  axis: AxisConfig;
  isDefaultAxis: boolean;
};

export type ExtremumGetterResult = [number, number] | [null, null];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;

export type FormatterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[T]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type FormatterResult<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<T>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type DatasetElementType<T> = {
  [key: string]: T;
};
export type DatasetType<T = number | string | Date | null | undefined> = DatasetElementType<T>[];

export type Formatter<T extends ChartSeriesType> = (
  params: FormatterParams<T>,
  dataset?: DatasetType,
) => FormatterResult<T>;

export type LegendParams = {
  /**
   * The color used in the legend
   */
  color: string;
  /**
   * The label displayed in the legend
   */
  label: string;
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: SeriesId;
};

export type LegendGetter<T extends ChartSeriesType> = (
  series: FormatterResult<T>,
) => LegendParams[];
