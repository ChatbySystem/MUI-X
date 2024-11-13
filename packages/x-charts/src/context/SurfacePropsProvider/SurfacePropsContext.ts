import * as React from 'react';

import { Initializable } from '../context.types';
import { SurfacePropsContextState } from './SurfaceProps.types';

export const SurfacePropsContext = React.createContext<Initializable<SurfacePropsContextState>>({
  isInitialized: false,
  data: {},
});

if (process.env.NODE_ENV !== 'production') {
  SurfacePropsContext.displayName = 'SurfacePropsContext';
}