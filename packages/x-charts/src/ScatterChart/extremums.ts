import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

const mergeMinMax = (
  acc: ExtremumGetterResult,
  val: ExtremumGetterResult,
): ExtremumGetterResult => {
  return [Math.min(acc[0], val[0]), Math.max(acc[1], val[1])];
};

export const getExtremumX: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].xAxisId ?? series[seriesId].xAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: ExtremumGetterResult, { x }) => {
            const val = [x, x] as ExtremumGetterResult;
            return mergeMinMax(accSeries, val);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [Infinity, -Infinity],
    );
};

export const getExtremumY: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: ExtremumGetterResult, { y }) => {
            const val = [y, y] as ExtremumGetterResult;
            return mergeMinMax(accSeries, val);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [Infinity, -Infinity],
    );
};
