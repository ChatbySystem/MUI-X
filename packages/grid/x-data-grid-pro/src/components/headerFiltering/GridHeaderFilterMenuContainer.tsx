import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridFilterItem,
  GridFilterOperator,
  useGridApiContext,
  GridColDef,
} from '@mui/x-data-grid';
import { refType, unstable_useId as useId } from '@mui/utils';
import { unstable_gridHeaderFilteringMenuSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const sx = {
  width: 22,
  height: 22,
  margin: 'auto 0 10px 5px',
};

function GridHeaderFilterMenuContainer(props: {
  operators: GridFilterOperator<any, any, any>[];
  field: GridColDef['field'];
  item: GridFilterItem;
  applyFilterChanges: (item: GridFilterItem) => void;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
  buttonRef: React.Ref<HTMLButtonElement>;
}) {
  const { operators, item, field, buttonRef, headerFilterMenuRef, ...others } = props;

  const buttonId = useId();
  const menuId = useId();

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const open = Boolean(
    unstable_gridHeaderFilteringMenuSelector(apiRef) === field && headerFilterMenuRef.current,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    headerFilterMenuRef.current = event.currentTarget;
    apiRef.current.showHeaderFilterMenu(field);
  };

  if (!rootProps.slots.headerFilterMenu) {
    return null;
  }

  return (
    <React.Fragment>
      <rootProps.slots.baseIconButton
        id={buttonId}
        ref={buttonRef}
        aria-label={apiRef.current.getLocaleText('filterPanelOperator')}
        title={apiRef.current.getLocaleText('filterPanelOperator')}
        aria-controls={menuId}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        tabIndex={-1}
        size="small"
        onClick={handleClick}
        sx={sx}
        {...rootProps.slotProps?.baseIconButton}
      >
        <rootProps.slots.openFilterButtonIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
      <rootProps.slots.headerFilterMenu
        field={field}
        open={open}
        item={item}
        target={headerFilterMenuRef.current}
        operators={operators}
        labelledBy={buttonId!}
        id={menuId!}
        {...others}
      />
    </React.Fragment>
  );
}

GridHeaderFilterMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: PropTypes.func.isRequired,
  buttonRef: refType,
  field: PropTypes.string.isRequired,
  headerFilterMenuRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      getApplyFilterFn: PropTypes.func.isRequired,
      getValueAsString: PropTypes.func,
      headerLabel: PropTypes.string,
      InputComponent: PropTypes.elementType,
      InputComponentProps: PropTypes.object,
      label: PropTypes.string,
      requiresFilterValue: PropTypes.bool,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
} as any;

export { GridHeaderFilterMenuContainer };
