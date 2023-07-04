import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import {
  ResponsiveChartContainer,
  LinePlot,
  ChartsYAxis,
  useDrawingArea,
  useYScale,
} from '@mui/x-charts';

function ValueHighlight(props: { svgRef: React.RefObject<SVGSVGElement> }) {
  const { svgRef } = props;

  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
  const leftAxisScale = useYScale('left_axis_id') as ScaleLinear<any, any>;
  const rightAxisScale = useYScale('right_axis_id') as ScaleLinear<any, any>;

  const [mouseY, setMouseY] = React.useState<null | number>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleMouseOut = () => {
      setMouseY(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.offsetX;
      const y = event.offsetY;
      if (x < left || x > left + width) {
        setMouseY(null);
        return;
      }
      if (y < top - 10 || y > top + height + 10) {
        // Allows some margin if slightly on top/bottom of the drawing area
        setMouseY(null);
        return;
      }
      setMouseY(Math.max(Math.min(top + height, y), top)); // clamp to the drawing area
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [height, left, top, width, svgRef]);

  if (mouseY === null) {
    return null;
  }
  return (
    <React.Fragment>
      <path
        d={`M ${left} ${mouseY} l ${width} 0`}
        style={{
          fill: 'none',
          stroke: 'black',
          strokeDasharray: '5 2',
          strokeWidth: 1,
          pointerEvents: 'none',
        }}
      />
      <text
        x={left + 5}
        y={mouseY}
        textAnchor="start"
        alignmentBaseline="text-after-edge"
      >
        {leftAxisScale.invert(mouseY).toFixed(0)}
      </text>

      <text
        x={left + width - 5}
        y={mouseY}
        textAnchor="end"
        alignmentBaseline="text-after-edge"
      >
        {rightAxisScale.invert(mouseY).toFixed(0)}
      </text>
    </React.Fragment>
  );
}
export default function ScaleDemo() {
  const svgRef = React.useRef<SVGSVGElement>(null);
  return (
    <ResponsiveChartContainer
      ref={svgRef}
      margin={{ top: 20, left: 50, right: 50, bottom: 30 }}
      height={300}
      series={[
        {
          type: 'line',
          data: [5, 15, 20, 24, 30, 38, 40, 51, 52, 61],
          yAxisKey: 'left_axis_id',
        },
        {
          type: 'line',
          data: [
            50134, 48361, 46362, 44826, 42376, 40168, 38264, 36159, 34259, 32168,
          ],
          yAxisKey: 'right_axis_id',
        },
      ]}
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point' }]}
      yAxis={[
        {
          id: 'left_axis_id',
        },
        {
          id: 'right_axis_id',
        },
      ]}
    >
      <LinePlot />
      <ChartsYAxis position="left" axisId="left_axis_id" />
      <ChartsYAxis position="right" axisId="right_axis_id" />
      <ValueHighlight svgRef={svgRef} />
    </ResponsiveChartContainer>
  );
}
