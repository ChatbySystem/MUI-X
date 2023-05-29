import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector } from '../../utils/createSelector';
import { useLazyRef } from '../../hooks/utils/useLazyRef';
import { buildWarning } from '../../utils/warning';
import { fastShallowCompare } from '../../utils/fastShallowCompare';

const stateNotInitializedWarning = buildWarning([
  'MUI: `useGridSelector` has been called before the initialization of the state.',
  'This hook can only be used inside the context of the grid.',
]);

const noop = () => {};
const EMPTY = [] as unknown[];

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.acceptsApiRef;
}

export function applySelector<Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
) {
  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }
  return selector(apiRef.current.state);
}

export const defaultCompare = Object.is;
export const shallowCompare = fastShallowCompare;

const createRefs = () => ({ state: null, equals: null, selector: null } as any);

export const useGridSelector = <Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!apiRef.current.state) {
      stateNotInitializedWarning();
    }
  }

  const refs = useLazyRef<
    {
      state: T;
      equals: typeof equals;
      selector: typeof selector;
    },
    never
  >(createRefs);

  const didInit = refs.current.state !== null;

  const [state, setState] = React.useState<T>(
    (didInit ? null : applySelector(apiRef, selector)) as T,
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    didInit
      ? noop
      : () => {
          return apiRef.current.store.subscribe(() => {
            const newState = applySelector(apiRef, refs.current.selector);
            if (!equals(refs.current.state, newState)) {
              refs.current.state = newState;
              setState(newState);
            }
          });
        },
    EMPTY,
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  refs.current.state = state;
  refs.current.equals = equals;
  refs.current.selector = selector;

  return state;
};
