import type { ChartsPlugin } from '../context/PluginProvider';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPlugin<'radar'> = {
  seriesType: 'radar',
  colorProcessor: getColor,
  seriesFormatter: formatter,
};
