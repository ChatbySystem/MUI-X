'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { LegendPerItem, LegendPerItemProps } from './LegendPerItem';
import { LegendItemParams, SeriesLegendItemContext } from './chartsLegend.types';
import { useLegend } from '../hooks/useLegend';

const seriesContextBuilder = (context: LegendItemParams): SeriesLegendItemContext =>
  ({
    type: 'series',
    color: context.color,
    label: context.label,
    seriesId: context.seriesId!,
    itemId: context.itemId,
  }) as const;

export interface LegendRendererProps
  extends Omit<LegendPerItemProps, 'itemsToDisplay' | 'onItemClick'> {
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    legendItem: SeriesLegendItemContext,
    index: number,
  ) => void;
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden?: boolean;
}

function DefaultChartsLegend(props: LegendRendererProps) {
  const { hidden, onItemClick, ...other } = props;

  const { itemsToDisplay } = useLegend();

  if (hidden) {
    return null;
  }

  return (
    <LegendPerItem
      {...other}
      itemsToDisplay={itemsToDisplay}
      onItemClick={
        onItemClick
          ? (event, i) => onItemClick(event, seriesContextBuilder(itemsToDisplay[i]), i)
          : undefined
      }
    />
  );
}

DefaultChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']).isRequired,
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: PropTypes.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: PropTypes.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: PropTypes.number,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: PropTypes.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: PropTypes.number,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }).isRequired,
} as any;

export { DefaultChartsLegend };
