import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridParamsApi } from '../../../models/api/gridParamsApi';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  getGridCellElement,
  getGridColumnHeaderElement,
  getGridRowElement,
} from '../../../utils/domUtils';
import { GRID_ID_AUTOGENERATED } from './gridRowsUtils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';

export class MissingRowIdError extends Error {}

/**
 * @requires useGridColumns (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridEditing (method)
 * TODO: Impossible priority - useGridEditing also needs to be after useGridParamsApi
 * TODO: Impossible priority - useGridFocus also needs to be after useGridParamsApi
 */
export function useGridParamsApi(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'getRowId'>,
) {
  const { getRowId } = props;

  const getColumnHeaderParams = React.useCallback<GridParamsApi['getColumnHeaderParams']>(
    (field) => ({
      field,
      colDef: apiRef.current.getColumn(field),
    }),
    [apiRef],
  );

  const getRowParams = React.useCallback<GridParamsApi['getRowParams']>(
    (id) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        throw new MissingRowIdError(`No row with id #${id} found`);
      }

      const params: GridRowParams = {
        id,
        columns: apiRef.current.getAllColumns(),
        row,
      };
      return params;
    },
    [apiRef],
  );

  const getCellParams = React.useCallback<GridParamsApi['getCellParams']>(
    (id, field) => {
      const colDef = apiRef.current.getColumn(field);
      const value = apiRef.current.getCellValue(id, field);
      const row = apiRef.current.getRow(id);
      const rowNode = apiRef.current.getRowNode(id);

      if (!row || !rowNode) {
        throw new MissingRowIdError(`No row with id #${id} found`);
      }

      const cellFocus = gridFocusCellSelector(apiRef);
      const cellTabIndex = gridTabIndexCellSelector(apiRef);

      const params: GridCellParams<any, any, any, any> = {
        id,
        field,
        row,
        rowNode,
        colDef,
        cellMode: apiRef.current.getCellMode(id, field),
        hasFocus: cellFocus !== null && cellFocus.field === field && cellFocus.id === id,
        tabIndex: cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === id ? 0 : -1,
        value,
        formattedValue: value,
        isEditable: false,
      };
      if (colDef && colDef.valueFormatter) {
        params.formattedValue = colDef.valueFormatter({
          id,
          field: params.field,
          value: params.value,
          api: apiRef.current,
        });
      }
      params.isEditable = colDef && apiRef.current.isCellEditable(params);

      return params;
    },
    [apiRef],
  );

  const getCellValue = React.useCallback<GridParamsApi['getCellValue']>(
    (id, field) => {
      const colDef = apiRef.current.getColumn(field);

      if (!colDef || !colDef.valueGetter) {
        const rowModel = apiRef.current.getRow(id);

        if (!rowModel) {
          throw new MissingRowIdError(`No row with id #${id} found`);
        }

        return rowModel[field];
      }

      const row = apiRef.current.getRow(id);
      const value = row[colDef.field];
      return colDef.valueGetter(value, row, colDef, apiRef);
    },
    [apiRef],
  );

  const getRowValue = React.useCallback<GridParamsApi['getRowValue']>(
    (row, colDef) => {
      const field = colDef.field;

      if (!colDef || !colDef.valueGetter) {
        return row[field];
      }

      const value = row[colDef.field];
      return colDef.valueGetter(value, row, colDef, apiRef);
    },
    [apiRef],
  );

  const getRowFormattedValue = React.useCallback<GridParamsApi['getRowFormattedValue']>(
    (row, colDef) => {
      const value = getRowValue(row, colDef);

      if (!colDef || !colDef.valueFormatter) {
        return value;
      }

      const id = (getRowId ? getRowId(row) : row.id) ?? row[GRID_ID_AUTOGENERATED];
      const field = colDef.field;

      return colDef.valueFormatter({
        id,
        field,
        value,
        api: apiRef.current,
      });
    },
    [apiRef, getRowId, getRowValue],
  );

  const getColumnHeaderElement = React.useCallback<GridParamsApi['getColumnHeaderElement']>(
    (field) => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridColumnHeaderElement(apiRef.current.rootElementRef!.current!, field);
    },
    [apiRef],
  );
  const getRowElement = React.useCallback<GridParamsApi['getRowElement']>(
    (id) => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridRowElement(apiRef.current.rootElementRef!.current!, id);
    },
    [apiRef],
  );

  const getCellElement = React.useCallback<GridParamsApi['getCellElement']>(
    (id, field) => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridCellElement(apiRef.current.rootElementRef!.current!, { id, field });
    },
    [apiRef],
  );

  const paramsApi: GridParamsApi = {
    getCellValue,
    getCellParams,
    getCellElement,
    getRowValue,
    getRowFormattedValue,
    getRowParams,
    getRowElement,
    getColumnHeaderParams,
    getColumnHeaderElement,
  };

  useGridApiMethod(apiRef, paramsApi, 'public');
}
