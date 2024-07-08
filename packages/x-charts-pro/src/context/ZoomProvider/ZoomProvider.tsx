import * as React from 'react';
import { AxisConfig, ScaleName, ChartsXAxisProps, ChartsYAxisProps } from '@mui/x-charts';
import { cartesianProviderUtils } from '@mui/x-charts/internals';
import { ZoomContext } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { ZoomData } from './Zoom.types';

const { defaultizeAxis } = cartesianProviderUtils;

type ZoomProviderProps = {
  children: React.ReactNode;
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: Partial<Pick<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id' | 'zoom'>>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: Partial<Pick<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id' | 'zoom'>>[];
};

export function ZoomProvider({ children, xAxis: inXAxis, yAxis: inYAxis }: ZoomProviderProps) {
  const [isInteracting, setIsInteracting] = React.useState<boolean>(false);

  const xZoomOptions = React.useMemo(() => defaultizeZoom(defaultizeAxis(inXAxis, 'x')), [inXAxis]);
  const yZoomOptions = React.useMemo(() => defaultizeZoom(defaultizeAxis(inYAxis, 'y')), [inYAxis]);

  const [zoomData, setZoomData] = React.useState<ZoomData[]>([
    ...(xZoomOptions?.map((v) => ({ axisId: v.axisId, min: v.min, max: v.max })) ?? []),
    ...(yZoomOptions?.map((v) => ({ axisId: v.axisId, min: v.min, max: v.max })) ?? []),
  ]);

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        isZoomEnabled: Boolean(xZoomOptions || yZoomOptions),
        isPanEnabled: isPanEnabled(xZoomOptions, yZoomOptions),
        xOptions: xZoomOptions || [],
        yOptions: yZoomOptions || [],
        zoomData,
        setZoomData,
        isInteracting,
        setIsInteracting,
      },
    }),
    [zoomData, setZoomData, isInteracting, setIsInteracting, xZoomOptions, yZoomOptions],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

function isPanEnabled(x?: { panning?: boolean }[], y?: { panning?: boolean }[]): boolean {
  return x?.some((v) => v.panning) || y?.some((v) => v.panning) || false;
}
