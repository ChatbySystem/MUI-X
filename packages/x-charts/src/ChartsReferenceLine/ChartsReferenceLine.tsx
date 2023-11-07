import * as React from 'react';
import PropTypes from 'prop-types';
import ChartsXReferenceLine, { ChartsXReferenceLineProps } from './ChartsXReferenceLine';
import ChartsYReferenceLine, { ChartsYReferenceLineProps } from './ChartsYReferenceLine';
import { XOR } from '../internals/utils';

type ChartsReferenceLineProps<TValue extends string | number | Date = string | number | Date> = XOR<
  ChartsXReferenceLineProps<TValue>,
  ChartsYReferenceLineProps<TValue>
>;

function ChartsReferenceLine(props: ChartsReferenceLineProps) {
  if (props.x !== undefined && props.y !== undefined) {
    throw new Error('MUI-X: The ChartsReferenceLine can not have both `x` and `y` props set.');
  }

  if (props.x === undefined && props.y === undefined) {
    throw new Error('MUI-X: The ChartsReferenceLine should have a value in `x` or `y` prop.');
  }

  if (props.x !== undefined) {
    return <ChartsXReferenceLine {...props} />;
  }
  return <ChartsYReferenceLine {...props} />;
}

ChartsReferenceLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId: PropTypes.string,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The label to display along the reference line.
   */
  label: PropTypes.string,
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign: PropTypes.oneOf(['end', 'middle', 'start']),
  /**
   * The style applied to the label.
   */
  labelStyle: PropTypes.object,
  /**
   * The style applied to the line.
   */
  lineStyle: PropTypes.object,
  /**
   * Additional space between the label and the reference line in px.
   * @default 5
   */
  spacing: PropTypes.number,
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  /**
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
} as any;

export { ChartsReferenceLine };
