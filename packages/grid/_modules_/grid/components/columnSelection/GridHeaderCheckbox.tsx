import * as React from 'react';
import PropTypes from 'prop-types';
import { GridEvents } from '../../constants/eventsConstants';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../../hooks/features/pagination/gridPaginationSelector';
import { visibleSortedGridRowIdsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridTabIndexColumnHeaderSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../../hooks/features/selection/gridSelectionSelector';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const GridHeaderCheckbox = React.forwardRef<HTMLInputElement, GridColumnHeaderParams>(
  function GridHeaderCheckbox(props, ref) {
    const [, forceUpdate] = React.useState(false);
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
    const totalSelectedRows = useGridSelector(apiRef, selectedGridRowsCountSelector);
    const totalRows = useGridSelector(apiRef, gridRowCountSelector);

    const isIndeterminate = totalSelectedRows > 0 && totalSelectedRows !== totalRows;
    // TODO core v5 remove || isIndeterminate, no longer has any effect
    const isChecked = (totalSelectedRows > 0 && totalSelectedRows === totalRows) || isIndeterminate;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      const rowsToBeSelected = rootProps.checkboxSelectionVisibleOnly
        ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef.current.state)
        : visibleSortedGridRowIdsSelector(apiRef.current.state);
      apiRef!.current.selectRows(rowsToBeSelected, checked, !event.target.indeterminate);
    };

    const tabIndex = tabIndexState !== null && tabIndexState.field === props.field ? 0 : -1;
    React.useLayoutEffect(() => {
      const element = apiRef!.current.getColumnHeaderElement(props.field);
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [tabIndex, apiRef, props.field]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef!.current.publishEvent(GridEvents.columnHeaderNavigationKeyDown, props, event);
        }
      },
      [apiRef, props],
    );

    const handleSelectionChange = React.useCallback(() => {
      forceUpdate((p) => !p);
    }, []);

    React.useEffect(() => {
      return apiRef?.current.subscribeEvent(GridEvents.selectionChange, handleSelectionChange);
    }, [apiRef, handleSelectionChange]);

    const CheckboxComponent = apiRef?.current.components.Checkbox!;

    return (
      <CheckboxComponent
        ref={ref}
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={handleChange}
        className={gridClasses.checkboxInput}
        color="primary"
        inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        {...apiRef?.current.componentsProps?.checkbox}
      />
    );
  },
);

GridHeaderCheckbox.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The column of the current header component.
   */
  colDef: PropTypes.shape({
    align: PropTypes.oneOf(['center', 'left', 'right']),
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    computedWidth: PropTypes.number.isRequired,
    description: PropTypes.string,
    disableColumnMenu: PropTypes.bool,
    disableExport: PropTypes.bool,
    disableReorder: PropTypes.bool,
    editable: PropTypes.bool,
    field: PropTypes.string.isRequired,
    filterable: PropTypes.bool,
    filterOperators: PropTypes.arrayOf(
      PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.object,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    flex: PropTypes.number,
    headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
    headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    headerName: PropTypes.string,
    hide: PropTypes.bool,
    hideSortIcons: PropTypes.bool,
    minWidth: PropTypes.number,
    renderCell: PropTypes.func,
    renderEditCell: PropTypes.func,
    renderHeader: PropTypes.func,
    resizable: PropTypes.bool,
    sortable: PropTypes.bool,
    sortComparator: PropTypes.func,
    type: PropTypes.string,
    valueFormatter: PropTypes.func,
    valueGetter: PropTypes.func,
    valueOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
    valueParser: PropTypes.func,
    width: PropTypes.number,
  }).isRequired,
  /**
   * The column field of the column that triggered the event
   */
  field: PropTypes.string.isRequired,
} as any;

export { GridHeaderCheckbox };
