import * as React from 'react';
import clsx from 'clsx'
import { css, useStyled } from '@mui/x-data-grid/internals';
import {
  GridColumnHeaderParams,
  GridColumnHeaderTitle,
} from '@mui/x-data-grid';
import type { GridBaseColDef } from '@mui/x-data-grid/internals';
import { getAggregationFunctionLabel } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const headerStyled = css({
  name: 'MuiDataGrid',
  slot: 'aggregationColumnHeader',
}, {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignLeft: {},
});

const labelStyled = css({
  name: 'MuiDataGrid',
  slot: 'aggregationColumnHeaderLabel',
}, {
  root: {
    // FIXME: CSS vars not implemented
    fontSize: 'var(--DataGrid-typography-caption-fontSize)',
    lineHeight: 'normal',
    color: 'var(--DataGrid-palette-text-secondary)',
    marginTop: -1,
  },
});

function GridAggregationHeader(
  props: GridColumnHeaderParams & {
    renderHeader: GridBaseColDef['renderHeader'];
  },
) {
  const { renderHeader, ...params } = props;
  const { colDef, aggregation } = params;
  const { headerAlign } = colDef;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  if (!aggregation) {
    return null;
  }

  const headerClasses = useStyled(headerStyled, rootProps)
  const labelClasses = useStyled(labelStyled, rootProps)

  const aggregationLabel = getAggregationFunctionLabel({
    apiRef,
    aggregationRule: aggregation.aggregationRule,
  });

  const headerClassName = clsx(
    headerClasses.root,
    headerAlign === 'left' && headerClasses.alignLeft,
    headerAlign === 'center' && headerClasses.alignCenter,
    headerAlign === 'right' && headerClasses.alignRight,
  );

  return (
    <div className={headerClassName}>
      {renderHeader ? (
        renderHeader(params)
      ) : (
        <GridColumnHeaderTitle
          label={colDef.headerName ?? colDef.field}
          description={colDef.description}
          columnWidth={colDef.computedWidth}
        />
      )}
      <div className={labelClasses.root}>
        {aggregationLabel}
      </div>
    </div>
  );
}

export { GridAggregationHeader };
