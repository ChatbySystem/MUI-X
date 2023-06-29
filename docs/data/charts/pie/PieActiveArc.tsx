import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieActiveArc() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
          faded: { innerRadius: 0, additionalRaidus: -20 },
          highlightScope: { faded: 'global', highlighted: 'item' },
        },
      ]}
      width={400}
      height={200}
    />
  );
}
