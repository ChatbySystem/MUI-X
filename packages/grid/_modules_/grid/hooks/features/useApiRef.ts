import * as React from 'react';
import { ApiContext } from '../../components/api-context';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';
import { useForkRef } from '@material-ui/core/utils';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */

function createGridApi(): GridApi {
  return new EventEmitter() as GridApi;
}

export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  const internalApiRef = React.useRef<GridApi>(createGridApi());
  // const [state, setState] = React.useState(internalApiRef);

  // const apiRef = React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);
  // eslint-disable-next-line no-console
  // console.log(`Apiref Id: ${apiRef.current.id}`)



  React.useEffect(()=> {
    if(apiRefProp) {
      apiRefProp.current = internalApiRef.current;
    }
  });

  return internalApiRef;

  // const apiRef = React.useContext(ApiContext);
  // const internalApiRef = React.useRef<GridApi>(createGridApi());
  // if(apiRef) {
  //   return apiRef
  // }
  // if(apiRefProp) {
  //   return apiRefProp;
  // }
//
// return internalApiRef

  // const apiRef = useForkRef(internalApiRef, apiRefProp);
    
    //React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);

  // return apiRef;
}
