import * as React from 'react';
import { GridVirtualScroller } from './virtualization/GridVirtualScroller';
import { GridVirtualScrollerContent } from './virtualization/GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from './virtualization/GridVirtualScrollerRenderZone';
import { useGridVirtualScroller } from '../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from './base/GridOverlays';

import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridColumnPositionsSelector,
  gridColumnVisibilityModelSelector,
  gridVisibleColumnDefinitionsSelector,
} from '../hooks/features/columns/gridColumnsSelector';
import { gridFilterActiveItemsLookupSelector } from '../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../hooks/features/sorting/gridSortingSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
  unstable_gridTabIndexColumnGroupHeaderSelector,
  unstable_gridFocusColumnGroupHeaderSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import { gridDensityFactorSelector } from '../hooks/features/density/densitySelector';
import {
  gridColumnGroupsHeaderMaxDepthSelector,
  gridColumnGroupsHeaderStructureSelector,
} from '../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { gridColumnMenuSelector } from '../hooks/features/columnMenu/columnMenuSelector';

interface DataGridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  disableVirtualization?: boolean;
}

const DataGridVirtualScroller = React.forwardRef<HTMLDivElement, DataGridVirtualScrollerProps>(
  function DataGridVirtualScroller(props, ref) {
    const { className, disableVirtualization, ...other } = props;

    const { getRootProps, getContentProps, getRenderZoneProps, getRows } = useGridVirtualScroller({
      ref,
      disableVirtualization,
    });

    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();

    const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
    const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
    const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
    const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
    const columnHeaderTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
    const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
    const columnGroupHeaderTabIndexState = useGridSelector(
      apiRef,
      unstable_gridTabIndexColumnGroupHeaderSelector,
    );

    const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
    const columnGroupHeaderFocus = useGridSelector(
      apiRef,
      unstable_gridFocusColumnGroupHeaderSelector,
    );

    const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
    const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);

    const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
    const columnVisibility = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
    const columnGroupsHeaderStructure = useGridSelector(
      apiRef,
      gridColumnGroupsHeaderStructureSelector,
    );

    const hasOtherElementInTabSequence = !(
      columnGroupHeaderTabIndexState === null &&
      columnHeaderTabIndexState === null &&
      cellTabIndexState === null
    );

    const columnHeadersRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);

    apiRef.current.register('private', {
      columnHeadersContainerElementRef: columnsContainerRef,
      columnHeadersElementRef: columnHeadersRef,
    });

    return (
      <GridVirtualScroller className={className} {...getRootProps(other)}>
        <rootProps.slots.columnHeaders
          ref={columnsContainerRef}
          innerRef={columnHeadersRef}
          visibleColumns={visibleColumns}
          filterColumnLookup={filterColumnLookup}
          sortColumnLookup={sortColumnLookup}
          columnPositions={columnPositions}
          columnHeaderTabIndexState={columnHeaderTabIndexState}
          columnGroupHeaderTabIndexState={columnGroupHeaderTabIndexState}
          columnHeaderFocus={columnHeaderFocus}
          columnGroupHeaderFocus={columnGroupHeaderFocus}
          densityFactor={densityFactor}
          headerGroupingMaxDepth={headerGroupingMaxDepth}
          columnMenuState={columnMenuState}
          columnVisibility={columnVisibility}
          columnGroupsHeaderStructure={columnGroupsHeaderStructure}
          hasOtherElementInTabSequence={hasOtherElementInTabSequence}
          // {...ColumnHeadersProps}
        />
        <GridOverlays />
        <GridVirtualScrollerContent {...getContentProps()}>
          <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
            {getRows()}
          </GridVirtualScrollerRenderZone>
        </GridVirtualScrollerContent>
      </GridVirtualScroller>
    );
  },
);

export { DataGridVirtualScroller };
