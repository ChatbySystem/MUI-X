import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import {
  ResponsiveChartContainer,
  LinePlot,
  useDrawingArea,
  useYScale,
  useXScale,
} from '@mui/x-charts';

const x = Array.from({ length: 21 }, (_, index) => -1 + 0.2 * index);
const linear = x.map((v) => -1 + v);
const poly = x.map((v) => -1 + v ** 2 - v);

function CartesianAxis() {
  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
  const yAxisScale = useYScale() as ScaleLinear<any, any>;
  const xAxisScale = useXScale() as ScaleLinear<any, any>;

  const yOrigine = yAxisScale(0);
  const xOrigine = xAxisScale(0);

  const xTicks = [-2, -1, 1, 2, 3];
  const yTicks = [-2, -1, 1, 2, 3, 4, 5];

  return (
    <React.Fragment>
      {yTicks.map((value) => (
        <path
          key={value}
          d={`M ${left} ${yAxisScale(value)} l ${width} 0`}
          style={{
            fill: 'none',
            stroke: 'gray',
            strokeWidth: 1,
            pointerEvents: 'none',
          }}
        />
      ))}
      {xTicks.map((value) => (
        <path
          key={value}
          d={`M ${xAxisScale(value)} ${top} l 0 ${height}`}
          style={{
            fill: 'none',
            stroke: 'gray',
            strokeWidth: 1,
            pointerEvents: 'none',
          }}
        />
      ))}
      <path
        d={`M ${left} ${yOrigine} l ${width} 0`}
        style={{
          fill: 'none',
          stroke: 'black',
          strokeWidth: 2,
          pointerEvents: 'none',
        }}
      />
      <path
        d={`M ${xOrigine} ${top} l 0 ${height}`}
        style={{
          fill: 'none',
          stroke: 'black',
          strokeWidth: 2,
          pointerEvents: 'none',
        }}
      />
    </React.Fragment>
  );
}
export default function OrigineDemo() {
  return (
    <ResponsiveChartContainer
      margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
      height={300}
      series={[
        {
          type: 'line',
          data: linear,
        },

        {
          type: 'line',
          data: poly,
        },
      ]}
      xAxis={[{ data: x, scaleType: 'linear', min: -1, max: 3 }]}
      yAxis={[{ min: -2, max: 5 }]}
    >
      <CartesianAxis />
      <LinePlot />
    </ResponsiveChartContainer>
  );
}
