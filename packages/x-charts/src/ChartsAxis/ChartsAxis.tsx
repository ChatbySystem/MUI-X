import * as React from 'react';
import PropTypes from 'prop-types';
import { CartesianContext } from '../context/CartesianContextProvider';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import {
  AxisId,
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../models/axis';

export interface ChartsAxisProps {
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis?: null | string | ChartsYAxisProps;
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis?: null | string | ChartsYAxisProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsAxisSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsAxisSlotProps;
}

const getAxisId = (
  propsValue: undefined | null | string | ChartsXAxisProps | ChartsYAxisProps,
  defaultAxisId?: string,
): AxisId | null => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId ?? defaultAxisId ?? null;
  }
  return propsValue;
};

const mergeProps = (
  axisConfig: undefined | null | string | ChartsXAxisProps | ChartsYAxisProps,
  slots?: Partial<ChartsAxisSlots>,
  slotProps?: Partial<ChartsAxisSlotProps>,
) => {
  return typeof axisConfig === 'object'
    ? {
        ...axisConfig,
        slots: { ...slots, ...axisConfig?.slots },
        slotProps: { ...slotProps, ...axisConfig?.slotProps },
      }
    : { slots, slotProps };
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props: ChartsAxisProps) {
  const { topAxis, leftAxis, rightAxis, bottomAxis, slots, slotProps } = props;
  const { xAxis, xAxisIds, yAxis, yAxisIds } = React.useContext(CartesianContext);

  // TODO: use for plotting line without ticks or any thing
  // const drawingArea = React.useContext(DrawingContext);

  const leftId = getAxisId(leftAxis === undefined ? yAxisIds[0] : leftAxis);
  const bottomId = getAxisId(bottomAxis === undefined ? xAxisIds[0] : bottomAxis);
  const topId = getAxisId(topAxis, xAxisIds[0]);
  const rightId = getAxisId(rightAxis, yAxisIds[0]);

  if (topId !== null && !xAxis[topId]) {
    throw Error(
      [
        `MUI X Charts: id used for top axis "${topId}" is not defined.`,
        `Available ids are: ${xAxisIds.join(', ')}.`,
      ].join('\n'),
    );
  }
  if (leftId !== null && !yAxis[leftId]) {
    throw Error(
      [
        `MUI X Charts: id used for left axis "${leftId}" is not defined.`,
        `Available ids are: ${yAxisIds.join(', ')}.`,
      ].join('\n'),
    );
  }
  if (rightId !== null && !yAxis[rightId]) {
    throw Error(
      [
        `MUI X Charts: id used for right axis "${rightId}" is not defined.`,
        `Available ids are: ${yAxisIds.join(', ')}.`,
      ].join('\n'),
    );
  }
  if (bottomId !== null && !xAxis[bottomId]) {
    throw Error(
      [
        `MUI X Charts: id used for bottom axis "${bottomId}" is not defined.`,
        `Available ids are: ${xAxisIds.join(', ')}.`,
      ].join('\n'),
    );
  }
  const topAxisProps = mergeProps(topAxis, slots, slotProps);
  const bottomAxisProps = mergeProps(bottomAxis, slots, slotProps);
  const leftAxisProps = mergeProps(leftAxis, slots, slotProps);
  const rightAxisProps = mergeProps(rightAxis, slots, slotProps);

  return (
    <React.Fragment>
      {topId && <ChartsXAxis {...topAxisProps} position="top" axisId={topId} />}
      {bottomId && <ChartsXAxis {...bottomAxisProps} position="bottom" axisId={bottomId} />}
      {leftId && <ChartsYAxis {...leftAxisProps} position="left" axisId={leftId} />}
      {rightId && <ChartsYAxis {...rightAxisProps} position="right" axisId={rightId} />}
    </React.Fragment>
  );
}

ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['bottom', 'top']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['left', 'right']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['left', 'right']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      position: PropTypes.oneOf(['bottom', 'top']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
} as any;

export { ChartsAxis };
