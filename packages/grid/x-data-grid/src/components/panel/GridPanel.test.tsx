import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/monorepo/test/utils';
import {
  GridPanel,
  gridPanelClasses as classes,
  useGridApiRef,
  GridApiContext,
} from '@mui/x-data-grid';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext';
import Popper from '@mui/material/Popper';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props: { children: React.ReactNode }) {
    // mock rootProps
    const rootProps = {};
    const apiRef = useGridApiRef();
    apiRef.current.columnHeadersContainerElementRef = {
      // @ts-ignore
      current: document.body,
    };

    return (
      <GridRootPropsContext.Provider value={rootProps}>
        <GridApiContext.Provider value={apiRef} {...props} />
      </GridRootPropsContext.Provider>
    );
  }

  describeConformance(<GridPanel disablePortal open />, () => ({
    classes: classes as any,
    inheritComponent: Popper,
    render: (node: React.ReactNode) => render(<Wrapper>{node}</Wrapper>),
    muiName: 'MuiGridPanel',
    wrapMount:
      (baseMount: (node: React.ReactElement) => import('enzyme').ReactWrapper) =>
      (node: React.ReactNode) => {
        const wrapper = baseMount(
          <Wrapper>
            <span>{node}</span>
          </Wrapper>,
        );
        return wrapper.find('span').childAt(0);
      },
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
  }));
});
