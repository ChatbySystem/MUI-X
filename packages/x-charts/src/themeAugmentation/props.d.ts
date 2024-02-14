import { BarChartProps } from '../BarChart/BarChart';
import { BarElementProps } from '../BarChart/BarElement';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsReferenceLineProps } from '../ChartsReferenceLine';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { AreaElementProps, LineElementProps, MarkElementProps } from '../LineChart';
import { LineChartProps } from '../LineChart/LineChart';
import { PieArcLabelProps, PieArcProps } from '../PieChart';
import { ScatterProps } from '../ScatterChart/Scatter';
import { ScatterChartProps } from '../ScatterChart/ScatterChart';
import { ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';

export interface ChartsComponentsPropsList {
  MuiChartsAxis: ChartsAxisProps;
  MuiChartsXAxis: ChartsXAxisProps;
  MuiChartsYAxis: ChartsYAxisProps;
  MuiChartsAxisHighlight: ChartsAxisHighlightProps;
  MuiChartsClipPath: ChartsClipPathProps;
  MuiChartsLegend: ChartsLegendProps;
  MuiChartsTooltip: ChartsTooltipProps;
  MuiChartsSurface: ChartsSurfaceProps;

  // BarChart components
  MuiBarChart: BarChartProps;
  MuiBarElement: BarElementProps;

  // LineChart components
  MuiLineChart: LineChartProps;
  MuiAreaElement: AreaElementProps;
  MuiLineElement: LineElementProps;
  MuiMarkElement: MarkElementProps;

  // ScatterChart components
  MuiScatterChart: ScatterChartProps;
  MuiScatter: ScatterProps;

  // PieChart components
  MuiPieArc: PieArcProps;
  MuiPieArcLabel: PieArcLabelProps;

  // Reference line
  MuiChartsReferenceLine: ChartsReferenceLineProps;

  // Grid
  MuiChartsGrid: ChartsGridProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsComponentsPropsList {}
}

// disable automatic export
export {};
