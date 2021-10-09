import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GridEvents } from '../constants/eventsConstants';
import { GridRowId, GridRowData } from '../models/gridRows';
import { GridEditModes, GridRowModes, GridEditRowsModel } from '../models/gridEditRowModel';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { composeClasses } from '../utils/material-ui-utils';
import { getDataGridUtilityClass, gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';
import { GridCellIdentifier } from '../hooks/features/focus/gridFocusState';
import { GridScrollBarState } from '../models/gridContainerProps';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridEmptyCell } from './cell/GridEmptyCell';
import { GridRenderingState } from '../hooks/features/virtualization/renderingState';

interface GridRowProps {
  id: GridRowId;
  selected: boolean;
  index: number;
  rowHeight: number;
  row: GridRowData;
  renderState: GridRenderingState;
  firstColumnToRender: number;
  renderedColumns: GridStateColDef[];
  children: React.ReactNode;
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  editRowsModel: GridEditRowsModel;
  scrollBarState: GridScrollBarState;
}

type OwnerState = GridRowProps & {
  editable: boolean;
  editing: boolean;
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { editable, editing, selected, classes } = ownerState;

  const slots = {
    root: ['row', selected && 'selected', editable && 'row--editable', editing && 'row--editing'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridRow(props: GridRowProps) {
  const {
    selected,
    id,
    row,
    index,
    rowHeight,
    renderedColumns,
    firstColumnToRender,
    children,
    cellFocus,
    cellTabIndex,
    editRowsModel,
    scrollBarState, // to be removed
    renderState, // to be removed
    ...other
  } = props;
  const ariaRowIndex = index + 2; // 1 for the header row and 1 as it's 1 based
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(id) === GridRowModes.Edit,
    editable: rootProps.editMode === GridEditModes.Row,
  };

  const classes = useUtilityClasses(ownerState);

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      // The row might have been deleted
      if (!apiRef.current.getRow(id)) {
        return;
      }

      apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(id), event);
    },
    [apiRef, id],
  );

  const mouseEventsHandlers = React.useMemo<Partial<React.HTMLAttributes<HTMLDivElement>>>(
    () => ({
      onClick: publish(GridEvents.rowClick),
      onDoubleClick: publish(GridEvents.rowDoubleClick),
      onMouseOver: publish(GridEvents.rowOver),
      onMouseOut: publish(GridEvents.rowOut),
      onMouseEnter: publish(GridEvents.rowEnter),
      onMouseLeave: publish(GridEvents.rowLeave),
    }),
    [publish],
  );

  const style = {
    maxHeight: rowHeight,
    minHeight: rowHeight,
  };

  const rowClassName =
    typeof rootProps.getRowClassName === 'function' &&
    rootProps.getRowClassName(apiRef.current.getRowParams(id));

  const cells: JSX.Element[] = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;

    const isLastColumn = indexRelativeToAllColumns === renderedColumns.length - 1;
    const removeLastBorderRight =
      isLastColumn && scrollBarState.hasScrollX && !scrollBarState.hasScrollY;
    const showRightBorder = !isLastColumn
      ? rootProps.showCellRightBorder
      : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;

    const cellParams = apiRef.current.getCellParams(id, column.field);

    const classNames: string[] = [];

    if (column.cellClassName) {
      classNames.push(
        clsx(
          typeof column.cellClassName === 'function'
            ? column.cellClassName(cellParams)
            : column.cellClassName,
        ),
      );
    }

    const editCellState = editRowsModel[id] && editRowsModel[id][column.field];
    let content: React.ReactNode = null;

    if (editCellState == null && column.renderCell) {
      content = column.renderCell({ ...cellParams, api: apiRef.current });
      // TODO move to GridCell
      classNames.push(
        clsx(gridClasses['cell--withRenderer'], rootProps.classes?.['cell--withRenderer']),
      );
    }

    if (editCellState != null && column.renderEditCell) {
      const params = { ...cellParams, ...editCellState, api: apiRef.current };
      content = column.renderEditCell(params);
      // TODO move to GridCell
      classNames.push(clsx(gridClasses['cell--editing'], rootProps.classes?.['cell--editing']));
    }

    if (rootProps.getCellClassName) {
      // TODO move to GridCell
      classNames.push(rootProps.getCellClassName(cellParams));
    }

    const hasFocus = cellFocus !== null && cellFocus.id === id && cellFocus.field === column.field;

    const tabIndex =
      cellTabIndex !== null &&
      cellTabIndex.id === id &&
      cellTabIndex.field === column.field &&
      cellParams.cellMode === 'view'
        ? 0
        : -1;

    cells.push(
      <rootProps.components.Cell
        key={column.field} // This is wrong. The key should be the index so the cells can be recycled.
        value={cellParams.value}
        field={column.field}
        width={column.computedWidth}
        rowId={id}
        height={rowHeight}
        showRightBorder={showRightBorder}
        formattedValue={cellParams.formattedValue}
        align={column.align || 'left'}
        rowIndex={index}
        cellMode={cellParams.cellMode}
        colIndex={indexRelativeToAllColumns}
        isEditable={cellParams.isEditable}
        isSelected={selected}
        hasFocus={hasFocus}
        tabIndex={tabIndex}
        className={clsx(classNames)}
        {...rootProps.componentsProps?.cell}
      >
        {content}
      </rootProps.components.Cell>,
    );
  }

  return (
    <div
      key={id}
      data-id={id}
      data-rowindex={index}
      role="row"
      className={clsx(rowClassName, classes.root)}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={style}
      {...mouseEventsHandlers}
      {...other}
    >
      <GridEmptyCell width={renderState.renderContext!.leftEmptyWidth} height={rowHeight} />
      {cells}
      <GridEmptyCell width={renderState.renderContext!.rightEmptyWidth} height={rowHeight} />
    </div>
  );
}

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellFocus: PropTypes.object,
  cellTabIndex: PropTypes.object,
  children: PropTypes.node,
  editRowsModel: PropTypes.object.isRequired,
  firstColumnToRender: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  index: PropTypes.number.isRequired,
  renderedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderState: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  rowHeight: PropTypes.number.isRequired,
  scrollBarState: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
} as any;

export { GridRow };
