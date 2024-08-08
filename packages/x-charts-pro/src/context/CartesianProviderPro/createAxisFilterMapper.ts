import { getAxisExtremum, FormattedSeries, ExtremumGettersConfig } from '@mui/x-charts/internals';
import { ChartsAxisProps, ScaleName, AxisConfig } from '@mui/x-charts';
import { ZoomData } from '../ZoomProvider';

type CreateAxisFilterMapperParams = {
  zoomData: ZoomData[];
  extremumGetter: ExtremumGettersConfig;
  formattedSeries: FormattedSeries;
};

export const createAxisFilterMapper =
  ({ zoomData, extremumGetter, formattedSeries }: CreateAxisFilterMapperParams) =>
  (axis: AxisConfig<ScaleName, any, ChartsAxisProps>, axisIndex: number) => {
    if (typeof axis.zoom !== 'object' || axis.zoom.filterMode !== 'discard') {
      return null;
    }

    const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
    if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
      // No zoom, or zoom with all data visible
      return null;
    }

    let min: number;
    let max: number;

    if (axis.scaleType === 'point' || axis.scaleType === 'band') {
      min = 0;
      max = (axis.data?.length ?? 0) - 1;
    } else {
      [min, max] = getAxisExtremum(axis, extremumGetter, axisIndex === 0, formattedSeries);
    }

    const minVal = min + (zoom.start * (max - min)) / 100;
    const maxVal = min + (zoom.end * (max - min)) / 100;

    return (dataIndex: number) => {
      const val = axis.data?.[dataIndex];
      if (val == null) {
        // If the value does not exist because of missing data point, or out of range index, we just ignore.
        return true;
      }

      if (axis.scaleType === 'point' || axis.scaleType === 'band') {
        return dataIndex >= minVal && dataIndex <= maxVal;
      }

      return val >= minVal && val <= maxVal;
    };
  };
