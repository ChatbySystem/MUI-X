import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

function GridColumnMenuFilterItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(colDef.field);
    },
    [apiRef, colDef.field, onClick],
  );

  if (rootProps.disableColumnFilter || !colDef.filterable) {
    return null;
  }

  return (
    <rootProps.slots.baseMenuItem onClick={showFilter} {...rootProps.slotProps?.baseMenuItem}>
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuFilterIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        {apiRef.current.getLocaleText('columnMenuFilter')}
      </rootProps.slots.baseListItemText>
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuFilterItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuFilterItem };
