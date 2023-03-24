import { CartesianSeriesType, CommonSeriesType } from './common';

export interface LineSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'line';
  data: number[];
  stack?: string;
  area?: any;
}

/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type LineItemIdentifier = {
  type: 'line';
  seriesId: LineSeriesType['id'];
  /**
   * data Index can be undefined if the mouse is over the area and not a specific item.
   */
  dataIndex?: number;
};
