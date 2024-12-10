import { AxisId } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions, ZoomOptions } from './useChartProCartesianAxis.types';

const defaultZoomOptions: Required<ZoomOptions> = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
  filterMode: 'keep',
};

export const defaultizeZoom = (
  zoom: boolean | ZoomOptions | undefined,
  axisId: AxisId,
  axisDirection: 'x' | 'y',
): DefaultizedZoomOptions | undefined => {
  if (!zoom) {
    return undefined;
  }

  if (zoom === true) {
    return {
      axisId,
      axisDirection,
      ...defaultZoomOptions,
    };
  }

  return {
    axisId,
    axisDirection,
    ...defaultZoomOptions,
    ...zoom,
  };
};
