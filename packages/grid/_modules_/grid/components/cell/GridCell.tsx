import * as React from 'react';
import { ownerDocument, capitalize } from '@material-ui/core/utils';
import clsx from 'clsx';
import { GridEvents } from '../../constants/eventsConstants';
import { getDataGridUtilityClass } from '../../gridClasses';
import {
  GridAlignment,
  GridCellMode,
  GridCellModes,
  GridCellValue,
  GridOptions,
  GridRowId,
} from '../../models/index';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridCellProps {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  field: string;
  rowId: GridRowId;
  formattedValue?: GridCellValue;
  hasFocus?: boolean;
  height: number;
  isEditable?: boolean;
  isSelected?: boolean;
  rowIndex: number;
  showRightBorder?: boolean;
  value?: GridCellValue;
  width: number;
  cellMode?: GridCellMode;
  children: React.ReactNode;
  tabIndex: 0 | -1;
}

type OwnerState = GridCellProps & {
  classes?: GridOptions['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, showRightBorder, isEditable, classes } = ownerState;

  const slots = {
    root: [
      'cell',
      `cell__text${capitalize(align)}`,
      isEditable && 'cell__editable',
      showRightBorder && 'withBorder',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridCell = React.memo(function GridCell(props: GridCellProps) {
  const {
    children,
    colIndex,
    cellMode,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    isSelected,
    rowIndex,
    rowId,
    tabIndex,
    value,
    width,
    className,
  } = props;

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();

  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const publishBlur = React.useCallback(
    (eventName: string) => (event: React.FocusEvent<HTMLDivElement>) => {
      // We don't trigger blur when the focus is on an element in the cell.
      if (
        event.relatedTarget &&
        event.currentTarget.contains(event.relatedTarget as HTMLDivElement)
      ) {
        return;
      }

      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const publishMouseUp = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const publish = React.useCallback(
    (eventName: string) => (event: React.SyntheticEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      // The row might have been deleted during the click
      if (!apiRef.current.getRow(rowId)) {
        return;
      }

      const params = apiRef.current.getCellParams(rowId!, field || '');
      apiRef.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const eventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GridEvents.cellClick),
      onDoubleClick: publish(GridEvents.cellDoubleClick),
      onMouseDown: publish(GridEvents.cellMouseDown),
      onMouseUp: publishMouseUp(GridEvents.cellMouseUp),
      onMouseOver: publish(GridEvents.cellOver),
      onMouseOut: publish(GridEvents.cellOut),
      onMouseEnter: publish(GridEvents.cellEnter),
      onMouseLeave: publish(GridEvents.cellLeave),
      onKeyDown: publish(GridEvents.cellKeyDown),
      onBlur: publishBlur(GridEvents.cellBlur),
      onFocus: publish(GridEvents.cellFocus),
      onDragStart: publish(GridEvents.cellDragStart),
      onDragEnter: publish(GridEvents.cellDragEnter),
      onDragOver: publish(GridEvents.cellDragOver),
    }),
    [publish, publishBlur, publishMouseUp],
  );

  const style = {
    minWidth: width,
    maxWidth: width,
    lineHeight: `${height - 1}px`,
    minHeight: height,
    maxHeight: height,
  };

  React.useLayoutEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement)!;

    if (cellRef.current && !cellRef.current.contains(doc.activeElement!)) {
      const focusableElement = cellRef.current!.querySelector('[tabindex="0"]') as HTMLElement;
      if (focusableElement) {
        focusableElement!.focus();
      } else {
        cellRef.current!.focus();
      }
    }
  });

  return (
    <div
      ref={cellRef}
      className={clsx(className, classes.root)}
      role="cell"
      data-value={value}
      data-field={field}
      data-rowindex={rowIndex}
      data-colindex={colIndex}
      data-rowselected={isSelected}
      data-editable={isEditable}
      data-mode={cellMode}
      aria-colindex={colIndex + 1}
      style={style}
      tabIndex={cellMode === 'view' || !isEditable ? tabIndex : -1}
      {...eventsHandlers}
    >
      {children != null ? children : valueToRender?.toString()}
    </div>
  );
});
