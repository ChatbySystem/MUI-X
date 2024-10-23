import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

export const radiusExtremumGetter: ExtremumGetter<'radar'> = ({ series, axisIndex }) => {
  return Object.keys(series)
    .filter((seriesId) => series[seriesId].type === 'radar')
    .reduce<[number, number]>(
      (acc, seriesId) => {
        const { data } = series[seriesId];

        return [Math.min(data[axisIndex], acc[0]), Math.max(data[axisIndex], acc[1])];
      },
      [Infinity, -Infinity],
    );
};
