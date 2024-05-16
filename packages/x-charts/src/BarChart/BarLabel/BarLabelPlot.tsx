import * as React from 'react';
import PropTypes from 'prop-types';
import { to, useTransition } from '@react-spring/web';
import type { AnimationData, CompletedBarData } from '../types';
import { BarLabel } from './BarLabel';
import { BarLabelFunction } from './types';

const leaveStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: AnimationData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x,
        height: 0,
        width,
      }
    : {
        y,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const enterStyle = ({ x, width, y, height }: AnimationData) => ({
  y,
  x,
  height,
  width,
});

type BarLabelPlotProps = {
  bars: CompletedBarData[];
  skipAnimation?: boolean;
  barLabel?: 'value' | BarLabelFunction;
};

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { bars, skipAnimation, ...other } = props;

  const barLabelTransition = useTransition(bars, {
    keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
    from: leaveStyle,
    leave: null,
    enter: enterStyle,
    update: enterStyle,
    immediate: skipAnimation,
  });

  return (
    <React.Fragment>
      {barLabelTransition((style, { seriesId, dataIndex, color, value, width, height }) => (
        <BarLabel
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          width={width}
          height={height}
          {...other}
          style={
            {
              ...style,
              x: to([(style as any).x, (style as any).width], (x, w) => (x ?? 0) + w / 2),
              y: to([(style as any).y, (style as any).height], (y, w) => (y ?? 0) + w / 2),
            } as any
          }
        />
      ))}
    </React.Fragment>
  );
}

BarLabelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      dataIndex: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      layout: PropTypes.oneOf(['horizontal', 'vertical']),
      maskId: PropTypes.string.isRequired,
      seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      value: PropTypes.number,
      width: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      xOrigin: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      yOrigin: PropTypes.number.isRequired,
    }),
  ).isRequired,
  skipAnimation: PropTypes.bool,
} as any;

export { BarLabelPlot };
