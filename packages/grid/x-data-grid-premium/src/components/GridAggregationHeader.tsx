import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
  getDataGridUtilityClass,
  gridClasses,
  GridColDef,
  GridColumnHeaderParams,
  GridColumnHeaderTitle,
} from '@mui/x-data-grid';
import type { GridBaseColDef } from '@mui/x-data-grid/internals';
import { getAggregationFunctionLabel } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

interface OwnerState extends DataGridPremiumProcessedProps {
  classes: DataGridPremiumProcessedProps['classes'];
  colDef: GridColDef;
}

const GridAggregationHeaderRoot = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeader',
  overridesResolver: (_, styles) => styles.aggregationColumnHeader,
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  [`&.${gridClasses['aggregationColumnHeader--alignRight']}`]: {
    alignItems: 'flex-end',
  },
  [`&.${gridClasses['aggregationColumnHeader--alignCenter']}`]: {
    alignItems: 'center',
  },
});

const GridAggregationFunctionLabel = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeaderLabel',
  overridesResolver: (_, styles) => styles.aggregationColumnHeaderLabel,
})<{ ownerState: OwnerState }>(({ theme }) => {
  return {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.fontSize,
    position: 'absolute',
    bottom: 4,
    fontWeight: theme.typography.fontWeightMedium,
    color: (theme.vars || theme).palette.primary.dark,
    textTransform: 'uppercase',
  };
});

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, colDef } = ownerState;

  const slots = {
    root: [
      'aggregationColumnHeader',
      colDef.headerAlign === 'left' && 'aggregationColumnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'aggregationColumnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'aggregationColumnHeader--alignRight',
    ],
    aggregationLabel: ['aggregationColumnHeaderLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridAggregationHeader(
  props: GridColumnHeaderParams & {
    renderHeader: GridBaseColDef['renderHeader'];
  },
) {
  const { renderHeader, ...params } = props;
  const { colDef, aggregation } = params;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const ownerState = { ...rootProps, classes: rootProps.classes, colDef };
  const classes = useUtilityClasses(ownerState);

  if (!aggregation) {
    return null;
  }

  const aggregationLabel = getAggregationFunctionLabel({
    apiRef,
    aggregationRule: aggregation.aggregationRule,
  });

  return (
    <GridAggregationHeaderRoot ownerState={ownerState} className={classes.root}>
      {renderHeader ? (
        renderHeader(params)
      ) : (
        <GridColumnHeaderTitle
          label={colDef.headerName ?? colDef.field}
          description={colDef.description}
          columnWidth={colDef.computedWidth}
        />
      )}
      <GridAggregationFunctionLabel ownerState={ownerState} className={classes.aggregationLabel}>
        {aggregationLabel}
      </GridAggregationFunctionLabel>
    </GridAggregationHeaderRoot>
  );
}

export { GridAggregationHeader };
