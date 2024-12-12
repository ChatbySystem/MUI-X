import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { ContinuousColorLegendProps } from './ContinuousColorLegend';

export interface PiecewiseColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list items. */
  item: string;
  /** Styles applied to the legend in column layout. */
  vertical: string;
  /** Styles applied to the legend in row layout. */
  horizontal: string;
  /** Styles applied to the legend with the labels below the color marks. */
  below: string;
  /** Styles applied to the legend with the labels above the color marks. */
  above: string;
  /** Styles applied to the legend with the labels on the extremes of the color marks. */
  extremes: string;
  /** Styles applied to the legend with the labels on the left of the color marks. */
  left: string;
  /** Styles applied to the legend with the labels on the right of the color marks. */
  right: string;
}

function getLegendUtilityClass(slot: string) {
  return generateUtilityClass('MuiPiecewiseColorLegendClasses', slot);
}

export const useUtilityClasses = (props: ContinuousColorLegendProps) => {
  const { classes, direction, labelPosition } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    item: ['item'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

export const piecewiseColorLegendClasses: PiecewiseColorLegendClasses = generateUtilityClasses(
  'MuiPiecewiseColorLegendClasses',
  [
    'root',
    'minLabel',
    'maxLabel',
    'item',
    'vertical',
    'horizontal',
    'below',
    'above',
    'extremes',
    'left',
    'right',
  ],
);
