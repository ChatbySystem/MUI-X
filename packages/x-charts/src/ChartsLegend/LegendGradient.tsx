import * as React from 'react';
import { ScaleSequential } from 'd3-scale';
import ChartsContinuousGradient from '../internals/components/ChartsAxesGradients/ChartsContinuousGradient';
import { ContinuousScaleName } from '../models/axis';
import { ChartsLegendProps } from './ChartsLegend';
import { useDrawingArea } from '../hooks';
import { getScale } from '../internals/getScale';
import { ContinuousColorConfig } from '../models/colorMapping';
import { getPercentageValue } from '../internals/utils';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { ChartsTextBaseline, ChartsTextStyle } from '../internals/getWordsByLines';
import { getStringSize } from '../internals/domUtils';
import { AnchorPosition } from './utils';

type BoundingBox = {
  width: number;
  height: number;
};

interface Position {
  x: number;
  y: number;
}
interface TextPosition extends Position {
  dominantBaseline: ChartsTextBaseline;
  textAnchor: ChartsTextStyle['textAnchor'];
}

function getPositionOffset(position: AnchorPosition, legendBox: BoundingBox, svgBox: BoundingBox) {
  let offsetX = 0;
  let offsetY = 0;

  switch (position.horizontal) {
    case 'left':
      offsetX = 0;
      break;
    case 'middle':
      offsetX = (svgBox.width - legendBox.width) / 2;
      break;
    case 'right':
    default:
      offsetX = svgBox.width - legendBox.width;
      break;
  }
  switch (position.vertical) {
    case 'top':
      offsetY = 0;
      break;
    case 'middle':
      offsetY = (svgBox.height - legendBox.height) / 2;
      break;
    case 'bottom':
    default:
      offsetY = svgBox.height - legendBox.height;
      break;
  }

  return { offsetX, offsetY };
}

function getElementPositions(
  text1Box: BoundingBox,
  barBox: BoundingBox,
  text2Box: BoundingBox,
  params: {
    spacing: number;
    alignment: LegendGradientProps['alignment'];
    direction: LegendGradientProps['direction'];
  },
): {
  text1: TextPosition;
  text2: TextPosition;
  bar: Position;
  boundingBox: BoundingBox;
} {
  if (params.direction === 'column') {
    const text1 = { y: text1Box.height, dominantBaseline: 'auto' } as const;
    const text2 = {
      y: text1Box.height + 2 * params.spacing + barBox.height,
      dominantBaseline: 'hanging',
    } as const;
    const bar = { y: text1Box.height + params.spacing };

    const totalWidth = Math.max(text1Box.width, barBox.width, text2Box.width);
    const totalHeight = text1Box.height + barBox.height + text2Box.height + 2 * params.spacing;

    const boundingBox = { width: totalWidth, height: totalHeight };
    switch (params.alignment) {
      case 'start':
        return {
          text1: { ...text1, textAnchor: 'start', x: 0 },
          text2: { ...text2, textAnchor: 'start', x: 0 },
          bar: { ...bar, x: 0 },
          boundingBox,
        };
      case 'end':
        return {
          text1: { ...text1, textAnchor: 'end', x: totalWidth },
          text2: { ...text2, textAnchor: 'end', x: totalWidth },
          bar: { ...bar, x: totalWidth - barBox.width },
          boundingBox,
        };
      case 'middle':
      default:
        return {
          text1: { ...text1, textAnchor: 'middle', x: totalWidth / 2 },
          text2: { ...text2, textAnchor: 'middle', x: totalWidth / 2 },
          bar: { ...bar, x: totalWidth / 2 - barBox.width / 2 },
          boundingBox,
        };
    }
  } else {
    const text1 = { x: text1Box.width, textAnchor: 'end' } as const;
    const text2 = {
      x: text1Box.width + 2 * params.spacing + barBox.width,
      textAnchor: 'start',
    } as const;
    const bar = { x: text1Box.width + params.spacing };

    const totalHeight = Math.max(text1Box.height, barBox.height, text2Box.height);
    const totalWidth = text1Box.width + barBox.width + text2Box.width + 2 * params.spacing;

    const boundingBox = { width: totalWidth, height: totalHeight };

    switch (params.alignment) {
      case 'start':
        return {
          text1: { ...text1, dominantBaseline: 'hanging', y: 0 },
          text2: { ...text2, dominantBaseline: 'hanging', y: 0 },
          bar: { ...bar, y: 0 },
          boundingBox,
        };
      case 'end':
        return {
          text1: { ...text1, dominantBaseline: 'auto', y: totalHeight },
          text2: { ...text2, dominantBaseline: 'auto', y: totalHeight },
          bar: { ...bar, y: totalHeight - barBox.height },
          boundingBox,
        };
      case 'middle':
      default:
        return {
          text1: { ...text1, dominantBaseline: 'central', y: totalHeight / 2 },
          text2: { ...text2, dominantBaseline: 'central', y: totalHeight / 2 },
          bar: { ...bar, y: totalHeight / 2 - barBox.height / 2 },
          boundingBox,
        };
    }
  }
}
interface LegendGradientProps extends Pick<ChartsLegendProps, 'position' | 'direction'> {
  colorScale: ScaleSequential<string, string | null>;
  colorMap: ContinuousColorConfig<number | Date>;
  /**
   * A unique identifier for the gradient.
   */
  id: string;
  /**
   * The scale used to display gradient colors.
   * @default 'linear
   */
  scaleType?: ContinuousScaleName;
  /**
   * The length of the gradient bar.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the length of the svg.
   * @default '50%'
   */
  length?: number | string;
  /**
   * The thickness of the gradient bar.
   * @default 5
   */
  thickness?: number;
  /**
   * The alignment of the texts with the gradient bar.
   * @default 'middle'
   */
  alignment?: 'start' | 'middle' | 'end';
  /**
   * The space between the gradient bar and the labels.
   * @default 4
   */
  spacing?: number;
  /**
   * The style applied to labels.
   */
  labelStyle?: ChartsTextProps['style'];
}

export function LegendGradient(props: LegendGradientProps) {
  const {
    colorScale,
    colorMap,
    id,
    scaleType = 'linear',
    direction,
    length = '50%',
    thickness = 5,
    spacing = 4,
    alignment = 'middle',
    labelStyle = {
      fontSize: 12,
      fontFamily: 'monospace',
      fontWeight: 400,
      lineHeight: 1,
      letterSpacing: '0.00938em',
    },
    position,
  } = props;
  const { width, height, left, right, top, bottom } = useDrawingArea();

  const refLength = direction === 'column' ? height + top + bottom : width + left + right;
  const size = getPercentageValue(length, refLength);

  const barBox =
    direction === 'column'
      ? { width: thickness, height: size }
      : { width: size, height: thickness };

  const isReversed = direction === 'column';

  if (!colorScale || !colorMap) {
    return null;
  }
  const scale = getScale(
    scaleType,
    [colorMap.min, colorMap.max],
    isReversed ? [size, 0] : [0, size],
  );

  const text1 = 'txt1';
  const text2 = 'text long 2';

  const text1Box = getStringSize(text1, labelStyle);
  const text2Box = getStringSize(text2, labelStyle);

  const legendPositions = getElementPositions(text1Box, barBox, text2Box, {
    spacing,
    alignment,
    direction,
  });
  const svgBoundingBox = { width: width + left + right, height: height + top + bottom };

  const positionOffset = getPositionOffset(
    { horizontal: 'middle', vertical: 'top', ...position },
    legendPositions.boundingBox,
    svgBoundingBox,
  );

  return (
    <React.Fragment>
      <ChartsContinuousGradient
        isReversed={isReversed}
        gradientId={id}
        size={size}
        direction={direction === 'row' ? 'x' : 'y'}
        scale={scale}
        colorScale={colorScale}
        colorMap={colorMap}
        gradientUnits="objectBoundingBox"
      />

      <ChartsText
        text={text1}
        x={positionOffset.offsetX + legendPositions.text1.x}
        y={positionOffset.offsetY + legendPositions.text1.y}
        style={{
          dominantBaseline: legendPositions.text1.dominantBaseline,
          textAnchor: legendPositions.text1.textAnchor,
          ...labelStyle,
        }}
      />
      <rect
        x={positionOffset.offsetX + legendPositions.bar.x}
        y={positionOffset.offsetY + legendPositions.bar.y}
        {...barBox}
        fill={`url(#${id})`}
      />
      <ChartsText
        text={text2}
        x={positionOffset.offsetX + legendPositions.text2.x}
        y={positionOffset.offsetY + legendPositions.text2.y}
        style={{
          dominantBaseline: legendPositions.text2.dominantBaseline,
          textAnchor: legendPositions.text2.textAnchor,
          ...labelStyle,
        }}
      />
    </React.Fragment>
  );
}
