import * as React from 'react';
import { useDrawingArea, useXScale } from '../hooks';
import {
  CommonChartsReferenceLineProps,
  ReferenceLineRoot,
  getReferenceLineClasses,
} from './common';
import { ChartsText } from '../internals/components/ChartsText';

export type ChartsXReferenceLineProps<
  TValue extends string | number | Date = string | number | Date,
> = CommonChartsReferenceLineProps & {
  /**
   * The x value associated to the reference line.
   * If defined the reference line will be vertical.
   */
  x: TValue;
};

type GetTextPlacementParams = {
  top: number;
  height: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign'>;

const getTextParams = ({ top, height, labelAlign = 'middle' }: GetTextPlacementParams) => {
  switch (labelAlign) {
    case 'start':
      return {
        y: top,
        dominantBaseline: 'hanging' as const,
        textAnchor: 'start',
      };

    case 'end':
      return {
        y: top + height,
        dominantBaseline: 'auto' as const,
        textAnchor: 'start',
      };

    default:
      return {
        y: top + height / 2,
        dominantBaseline: 'central' as const,
        textAnchor: 'start',
      };
  }
};

function ChartsXReferenceLine(props: ChartsXReferenceLineProps) {
  const {
    x,
    label = '',
    spacing = 5,
    classes: classesProps,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { top, height } = useDrawingArea();
  const xAxisScale = useXScale(axisId) as any;

  const xPosition = xAxisScale(x);
  const d = `M ${xPosition} ${top} l 0 ${height}`;

  const classes = getReferenceLineClasses(classesProps);

  const textParams = {
    x: xPosition + spacing,
    text: label,
    ...getTextParams({
      top,
      height,
      labelAlign,
    }),
    className: classes.label,
  };

  return (
    <ReferenceLineRoot className={classes.root}>
      <path d={d} className={classes.line} style={lineStyle} />
      <ChartsText {...textParams} style={labelStyle} />
    </ReferenceLineRoot>
  );
}

export default ChartsXReferenceLine;
