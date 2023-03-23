import * as React from 'react';
import {
  GridColDef,
  gridFocusCellSelector,
  GridSingleSelectColDef,
  GridValidRowModel,
  gridVisibleColumnFieldsSelector,
  useGridNativeEventListener,
} from '@mui/x-data-grid';
import { getVisibleRows } from '@mui/x-data-grid/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

const stringToBoolean = (value: string) => {
  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
    case 'null':
    case 'undefined':
      return false;

    default:
      return JSON.parse(value);
  }
};

const parseCellStringValue = (value: string, colDef: GridColDef) => {
  switch (colDef.type) {
    case 'number': {
      return Number(value);
    }
    case 'boolean': {
      return stringToBoolean(value);
    }
    case 'singleSelect': {
      const colDefValueOptions = (colDef as GridSingleSelectColDef).valueOptions;
      const valueOptions =
        typeof colDefValueOptions === 'function'
          ? colDefValueOptions({ field: colDef.field })
          : colDefValueOptions || [];
      const valueOption = valueOptions.find((option) => {
        if (option === value) {
          return true;
        }
        // TODO: would it work with valueFormatter?
        if (typeof option === 'object' && option !== null) {
          if (String(option.label) === value) {
            return true;
          }
        }
        return false;
      });
      if (valueOption) {
        return valueOption;
      }
      return value;
    }
    case 'date':
    case 'dateTime': {
      const date = new Date(value);
      return date;
    }
    default:
      return value;
  }
};

export const useGridClipboardImport = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'pagination' | 'paginationMode' | 'onRowPaste'>,
): void => {
  const onRowPaste = props.onRowPaste;

  const handlePaste = React.useCallback(
    async (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (String.fromCharCode(event.keyCode) !== 'V' || !isModifierKeyPressed) {
        return;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (focusedCell !== null) {
        const cellMode = apiRef.current.getCellMode(focusedCell.id, focusedCell.field);
        if (cellMode === 'edit') {
          // Do not paste data when the cell is in edit mode
          return;
        }
      }

      // Do not enter cell edit mode on paste
      event.stopPropagation();

      const text = await navigator.clipboard.readText();
      if (!text) {
        return;
      }

      const rowsData = text.split('\r\n');

      const isSingleValuePasted = rowsData.length === 1 && rowsData[0].indexOf('\t') === -1;

      const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();
      const cellSelectionModelKeys = Object.keys(cellSelectionModel);

      if (cellSelectionModel && cellSelectionModelKeys.length > 0) {
        const rowsToEmit: [newRow: GridValidRowModel, oldRow: GridValidRowModel][] = [];
        const rowUpdates: GridValidRowModel[] = [];
        cellSelectionModelKeys.forEach((rowId, rowIndex) => {
          const targetRow = apiRef.current.getRow(rowId);
          const row: GridValidRowModel = { ...targetRow };
          const rowDataString = rowsData[isSingleValuePasted ? 0 : rowIndex];
          const hasRowData = isSingleValuePasted ? true : rowDataString !== undefined;
          if (!hasRowData) {
            return;
          }
          const rowData = rowDataString.split('\t');
          Object.keys(cellSelectionModel[rowId]).forEach((field, colIndex) => {
            const colDef = apiRef.current.getColumn(field);
            let cellValue: string;
            if (isSingleValuePasted) {
              cellValue = rowsData[0];
            } else {
              cellValue = rowData[colIndex];
            }
            const parsedValue = parseCellStringValue(cellValue, colDef);
            if (parsedValue !== undefined) {
              row[field] = parsedValue;
            }
          });
          rowUpdates.push(row);
          rowsToEmit.push([row, targetRow]);
        });
        apiRef.current.updateRows(rowUpdates);

        rowsToEmit.forEach((payload) => {
          if (typeof onRowPaste === 'function') {
            onRowPaste(...payload);
          }
        });
        return;
      }

      const selectedRows = apiRef.current.getSelectedRows();

      if (selectedRows.size === 1) {
        // Multiple values are pasted starting from the focused cell
        // return;
      }

      if (selectedRows.size > 1) {
        // Multiple values are pasted starting from the first and top-most cell
      }

      const selectedCell = gridFocusCellSelector(apiRef);
      if (!selectedCell || !selectedCell.id || !selectedCell.field) {
        return;
      }

      const selectedRowId = selectedCell.id;
      const selectedRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(selectedRowId);
      const visibleRows = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });

      const rowsToUpdate: GridValidRowModel[] = [];
      const rowsToEmit: [newRow: GridValidRowModel, oldRow: GridValidRowModel][] = [];
      rowsData.forEach((rowData, index) => {
        const parsedData = rowData.split('\t');
        const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
        const targetRow = visibleRows.rows[selectedRowIndex + index];

        if (!targetRow) {
          return;
        }

        const newRow: GridValidRowModel = { ...targetRow.model };
        const selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
        for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
          const field = visibleColumnFields[i];
          const stringValue = parsedData[i - selectedFieldIndex];
          if (typeof stringValue !== 'undefined') {
            const colDef = apiRef.current.getColumn(field);
            const parsedValue = parseCellStringValue(stringValue, colDef);
            newRow[field] = parsedValue;
          }
        }

        rowsToUpdate.push(newRow);
        rowsToEmit.push([newRow, targetRow.model]);
      });

      apiRef.current.updateRows(rowsToUpdate);
      rowsToEmit.forEach((payload) => {
        if (typeof onRowPaste === 'function') {
          onRowPaste(...payload);
        }
      });
    },
    [apiRef, props.pagination, props.paginationMode, onRowPaste],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);
};
