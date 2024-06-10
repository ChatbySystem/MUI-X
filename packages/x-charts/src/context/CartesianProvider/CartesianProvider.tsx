import * as React from 'react';
import { scaleBand, scalePoint } from 'd3-scale';
import {
  AxisConfig,
  AxisDefaultized,
  ChartsXAxisProps,
  ChartsYAxisProps,
  ScaleName,
  isBandScaleConfig,
  isPointScaleConfig,
} from '../../models/axis';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../../constants';
import {
  CartesianChartSeriesType,
  ChartSeriesType,
  DatasetType,
  ExtremumGetter,
  ExtremumGetterResult,
} from '../../models/seriesType/config';
import { MakeOptional } from '../../models/helpers';
import { getTickNumber } from '../../hooks/useTicks';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext, DefaultizedAxisConfig } from './CartesianContext';
import { getScale } from '../../internals/getScale';
import { normalizeAxis } from './normalizeAxis';

export type ExtremumGettersConfig<T extends ChartSeriesType = CartesianChartSeriesType> = {
  [K in T]?: ExtremumGetter<K>;
};

export type CartesianContextProviderProps = {
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
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  /**
   * An object with x-axis extremum getters per series type.
   */
  xExtremumGetters: ExtremumGettersConfig;
  /**
   * An object with y-axis extremum getters per series type.
   */
  yExtremumGetters: ExtremumGettersConfig;
  children: React.ReactNode;
};

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

function CartesianContextProvider(props: CartesianContextProviderProps) {
  const {
    xAxis: inXAxis,
    yAxis: inYAxis,
    dataset,
    xExtremumGetters,
    yExtremumGetters,
    children,
  } = props;
  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();

  const xAxis = React.useMemo(() => normalizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);

  const yAxis = React.useMemo(() => normalizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);

  const value = React.useMemo(() => {
    const axisExtremumCallback = <T extends keyof typeof xExtremumGetters>(
      acc: ExtremumGetterResult,
      chartType: T,
      axis: AxisConfig,
      getters: { [T2 in CartesianChartSeriesType]?: ExtremumGetter<T2> },
      isDefaultAxis: boolean,
    ): ExtremumGetterResult => {
      const getter = getters[chartType];
      const series = formattedSeries[chartType]?.series ?? {};

      const [minChartTypeData, maxChartTypeData] = getter?.({
        series,
        axis,
        isDefaultAxis,
      }) ?? [null, null];

      const [minData, maxData] = acc;

      if (minData === null || maxData === null) {
        return [minChartTypeData!, maxChartTypeData!];
      }

      if (minChartTypeData === null || maxChartTypeData === null) {
        return [minData, maxData];
      }

      return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
    };

    const getAxisExtremum = (
      axis: AxisConfig,
      getters: { [T in CartesianChartSeriesType]?: ExtremumGetter<T> },
      isDefaultAxis: boolean,
    ) => {
      const charTypes = Object.keys(getters);

      return charTypes.reduce<ExtremumGetterResult>(
        (acc, charType) =>
          axisExtremumCallback(
            acc,
            charType as CartesianChartSeriesType,
            axis,
            getters,
            isDefaultAxis,
          ),
        [null, null],
      );
    };

    const allXAxis: AxisConfig<ScaleName, any, ChartsXAxisProps>[] = [
      ...(xAxis?.map((axis, index) => ({ id: `defaultized-x-axis-${index}`, ...axis })) ?? []),
      // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
      ...(xAxis === undefined || xAxis.findIndex(({ id }) => id === DEFAULT_X_AXIS_KEY) === -1
        ? [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' as const }]
        : []),
    ];

    const completedXAxis: DefaultizedAxisConfig<ChartsXAxisProps> = {};
    allXAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters, isDefaultAxis);

      const range = axis.reverse
        ? [drawingArea.left + drawingArea.width, drawingArea.left]
        : [drawingArea.left, drawingArea.left + drawingArea.width];

      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
        completedXAxis[axis.id] = {
          categoryGapRatio,
          barGapRatio,
          ...axis,
          scale: scaleBand(axis.data!, range)
            .paddingInner(categoryGapRatio)
            .paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data!.length,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }
      if (isPointScaleConfig(axis)) {
        completedXAxis[axis.id] = {
          ...axis,
          scale: scalePoint(axis.data!, range),
          tickNumber: axis.data!.length,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }

      const scaleType = axis.scaleType ?? 'linear';

      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedXAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && getColorScale(axis.colorMap),
      } as AxisDefaultized<typeof scaleType, any, ChartsXAxisProps>;
    });

    const allYAxis: AxisConfig<ScaleName, any, ChartsYAxisProps>[] = [
      ...(yAxis?.map((axis, index) => ({ id: `defaultized-y-axis-${index}`, ...axis })) ?? []),
      ...(yAxis === undefined || yAxis.findIndex(({ id }) => id === DEFAULT_Y_AXIS_KEY) === -1
        ? [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' as const }]
        : []),
    ];

    const completedYAxis: DefaultizedAxisConfig<ChartsYAxisProps> = {};
    allYAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters, isDefaultAxis);
      const range = axis.reverse
        ? [drawingArea.top, drawingArea.top + drawingArea.height]
        : [drawingArea.top + drawingArea.height, drawingArea.top];

      if (isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        completedYAxis[axis.id] = {
          categoryGapRatio,
          barGapRatio: 0,
          ...axis,
          scale: scaleBand(axis.data!, [range[1], range[0]])
            .paddingInner(categoryGapRatio)
            .paddingOuter(categoryGapRatio / 2),
          tickNumber: axis.data!.length,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }
      if (isPointScaleConfig(axis)) {
        completedYAxis[axis.id] = {
          ...axis,
          scale: scalePoint(axis.data!, [range[1], range[0]]),
          tickNumber: axis.data!.length,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }
      if (axis.scaleType === 'band' || axis.scaleType === 'point') {
        // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
        return;
      }

      const scaleType = axis.scaleType ?? 'linear';

      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

      const niceScale = getScale(scaleType, extremums, range).nice(tickNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedYAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        tickNumber,
        colorScale: axis.colorMap && getColorScale(axis.colorMap),
      } as AxisDefaultized<typeof scaleType, any, ChartsYAxisProps>;
    });

    return {
      isInitialized: true,
      data: {
        xAxis: completedXAxis,
        yAxis: completedYAxis,
        xAxisIds: allXAxis.map(({ id }) => id),
        yAxisIds: allYAxis.map(({ id }) => id),
      },
    };
  }, [
    drawingArea.height,
    drawingArea.left,
    drawingArea.top,
    drawingArea.width,
    formattedSeries,
    xAxis,
    xExtremumGetters,
    yAxis,
    yExtremumGetters,
  ]);

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}

export { CartesianContextProvider };
