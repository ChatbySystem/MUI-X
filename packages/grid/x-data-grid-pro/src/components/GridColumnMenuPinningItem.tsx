import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { GridColumnMenuItemProps } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  textTransform: 'none',
}));

function GridColumnMenuPinningItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const pinColumn = (side: GridPinnedPosition) => (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.pinColumn(colDef.field, side);
    onClick(event);
  };

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(colDef.field);
    onClick(event);
  };

  if (!colDef) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(colDef.field);

  return (
    <React.Fragment>
      <Typography color="text.secondary" fontSize="12px">
        Pin to
      </Typography>
      <Stack direction="row">
        <StyledButton
          onClick={
            side === GridPinnedPosition.left ? unpinColumn : pinColumn(GridPinnedPosition.left)
          }
          startIcon={<rootProps.components.ColumnMenuPinLeftIcon />}
          color={side === GridPinnedPosition.left ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('directionLeft')}
        </StyledButton>
        <StyledButton
          onClick={
            side === GridPinnedPosition.right ? unpinColumn : pinColumn(GridPinnedPosition.right)
          }
          startIcon={<rootProps.components.ColumnMenuPinRightIcon />}
          color={side === GridPinnedPosition.right ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('directionRight')}
        </StyledButton>
      </Stack>
    </React.Fragment>
  );
}

GridColumnMenuPinningItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuPinningItem };
