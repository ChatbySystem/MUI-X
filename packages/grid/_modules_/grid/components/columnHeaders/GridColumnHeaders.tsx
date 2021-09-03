import * as React from 'react';
import clsx from 'clsx';
import { visibleGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridRenderStateSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridEmptyCell } from '../cell/GridEmptyCell';
import { GridScrollArea } from '../GridScrollArea';
import { GridColumnHeadersItemCollection } from './GridColumnHeadersItemCollection';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { gridContainerSizesSelector } from '../../hooks/root/gridContainerSizesSelector';
import { gridClasses } from '../../gridClasses';

export const gridScrollbarStateSelector = (state: GridState) => state.scrollBar;

export const GridColumnsHeader = React.forwardRef<HTMLDivElement, {}>(function GridColumnsHeader(
  props,
  ref,
) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const renderCtx = useGridSelector(apiRef, gridRenderStateSelector).renderContext;
  const { hasScrollX } = useGridSelector(apiRef, gridScrollbarStateSelector);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);

  const wrapperCssClasses = clsx(gridClasses.columnHeaderWrapper, {
    scroll: hasScrollX,
    [gridClasses.columnHeaderDropZone]: dragCol,
  });

  const renderedCols = React.useMemo(() => {
    if (renderCtx == null) {
      return [];
    }
    return columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx! + 1);
  }, [columns, renderCtx]);

  return (
    <React.Fragment>
      <GridScrollArea scrollDirection="left" />
      <div
        ref={ref}
        className={wrapperCssClasses}
        aria-rowindex={1}
        role="row"
        style={{ minWidth: containerSizes?.totalSizes?.width }}
      >
        <GridEmptyCell width={renderCtx?.leftEmptyWidth} height={headerHeight} />
        <GridColumnHeadersItemCollection columns={renderedCols} />
        <GridEmptyCell width={renderCtx?.rightEmptyWidth} height={headerHeight} />
      </div>
      <GridScrollArea scrollDirection="right" />
    </React.Fragment>
  );
});
