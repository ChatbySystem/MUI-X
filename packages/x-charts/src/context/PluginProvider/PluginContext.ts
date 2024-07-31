import * as React from 'react';
import { Initializable } from '../context.types';
import { PluginContextState } from './Plugin.types';

export const PluginContext = React.createContext<Initializable<PluginContextState>>({
  isInitialized: false,
  data: {},
});

if (process.env.NODE_ENV !== 'production') {
  PluginContext.displayName = 'PluginContext';
}
