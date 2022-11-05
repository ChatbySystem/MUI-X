import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../../hooks/features/filter/gridFilterSelector';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(() => ({
  fontSize: '16px',
  fontWeight: '400',
  textTransform: 'none',
}));

const GridFilterMenuItem = (props: GridColumnMenuItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  const isColumnFiltered = React.useMemo(() => {
    if (filterModel.items.length <= 0) {
      return false;
    }
    return filterModel.items.some((item) => item.columnField === column?.field);
  }, [column?.field, filterModel.items]);

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      apiRef.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  const clearFilters = React.useCallback(() => {
    if (isColumnFiltered) {
      apiRef.current.upsertFilterItems(
        filterModel.items.filter((item) => item.columnField !== column?.field),
      );
    }
  }, [apiRef, column?.field, filterModel.items, isColumnFiltered]);

  if (rootProps.disableColumnFilter || !column?.filterable) {
    return null;
  }

  return (
    <StyledStack>
      <StyledButton
        onClick={showFilter}
        startIcon={<rootProps.components.ColumnMenuFilterIcon />}
        color={isColumnFiltered ? 'primary' : 'inherit'}
        aria-label={apiRef.current.getLocaleText('columnMenuFilter') as string}
      >
        {apiRef.current.getLocaleText('columnMenuFilter')}
      </StyledButton>
      {isColumnFiltered && (
        <IconButton aria-label="clear filter" onClick={clearFilters}>
          <rootProps.components.ColumnMenuClearIcon />
        </IconButton>
      )}
    </StyledStack>
  );
};

GridFilterMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridFilterMenuItem };
