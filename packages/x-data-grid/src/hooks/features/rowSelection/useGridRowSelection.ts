import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridRowSelectionApi,
  GridRowMultiSelectionApi,
} from '../../../models/api/gridRowSelectionApi';
import { GridRowId } from '../../../models/gridRows';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridRowsLookupSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
import {
  gridRowSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridRowSelectionSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../pagination';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import {
  gridExpandedSortedRowIdsSelector,
  gridFilterModelSelector,
  gridFilteredSortedRowIdsSelector,
} from '../filter/gridFilterSelector';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_ACTIONS_COLUMN_TYPE } from '../../../colDef';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isKeyboardEvent, isNavigationKey } from '../../../utils/keyboardUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridRowSelectionModel } from '../../../models';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../constants/gridDetailPanelToggleField';
import { gridClasses } from '../../../constants/gridClasses';
import { isEventTargetInPortal } from '../../../utils/domUtils';
import { isMultipleRowSelectionEnabled, findRowsToSelect, findRowsToDeselect } from './utils';

const getSelectionModelPropValue = (
  selectionModelProp: DataGridProcessedProps['rowSelectionModel'],
  prevSelectionModel?: GridRowSelectionModel,
) => {
  if (selectionModelProp == null) {
    return selectionModelProp;
  }

  if (Array.isArray(selectionModelProp)) {
    return selectionModelProp;
  }

  if (prevSelectionModel && prevSelectionModel[0] === selectionModelProp) {
    return prevSelectionModel;
  }

  return [selectionModelProp];
};

export const rowSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'rowSelectionModel' | 'rowSelection'>
> = (state, props) => ({
  ...state,
  rowSelection: props.rowSelection ? getSelectionModelPropValue(props.rowSelectionModel) ?? [] : [],
});

/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */
export const useGridRowSelection = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'checkboxSelection'
    | 'rowSelectionModel'
    | 'onRowSelectionModelChange'
    | 'disableMultipleRowSelection'
    | 'disableRowSelectionOnClick'
    | 'isRowSelectable'
    | 'checkboxSelectionVisibleOnly'
    | 'pagination'
    | 'paginationMode'
    | 'classes'
    | 'keepNonExistentRowsSelected'
    | 'rowSelection'
    | 'propagateRowSelection'
    | 'signature'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridSelection');

  const runIfRowSelectionIsEnabled = React.useCallback(
    <Args extends any[]>(callback: (...args: Args) => void) =>
      (...args: Args) => {
        if (props.rowSelection) {
          callback(...args);
        }
      },
    [props.rowSelection],
  );

  const propRowSelectionModel = React.useMemo(() => {
    return getSelectionModelPropValue(
      props.rowSelectionModel,
      gridRowSelectionStateSelector(apiRef.current.state),
    );
  }, [apiRef, props.rowSelectionModel]);

  const lastRowToggled = React.useRef<GridRowId | null>(null);

  apiRef.current.registerControlState({
    stateId: 'rowSelection',
    propModel: propRowSelectionModel,
    propOnChange: props.onRowSelectionModelChange,
    stateSelector: gridRowSelectionStateSelector,
    changeEvent: 'rowSelectionChange',
  });

  const {
    checkboxSelection,
    disableRowSelectionOnClick,
    isRowSelectable: propIsRowSelectable,
  } = props;

  const canHaveMultipleSelection = isMultipleRowSelectionEnabled(props);
  const visibleRows = useGridVisibleRows(apiRef, props);
  const tree = useGridSelector(apiRef, gridRowTreeSelector);

  const expandMouseRowRangeSelection = React.useCallback(
    (id: GridRowId) => {
      let endId = id;
      const startId = lastRowToggled.current ?? id;
      const isSelected = apiRef.current.isRowSelected(id);
      if (isSelected) {
        const visibleRowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const startIndex = visibleRowIds.findIndex((rowId) => rowId === startId);
        const endIndex = visibleRowIds.findIndex((rowId) => rowId === endId);
        if (startIndex === endIndex) {
          return;
        }
        if (startIndex > endIndex) {
          endId = visibleRowIds[endIndex + 1];
        } else {
          endId = visibleRowIds[endIndex - 1];
        }
      }

      lastRowToggled.current = id;

      apiRef.current.selectRowRange({ startId, endId }, !isSelected);
    },
    [apiRef],
  );

  const setRowSelectionModel = React.useCallback<GridRowSelectionApi['setRowSelectionModel']>(
    (model) => {
      if (
        props.signature === GridSignature.DataGrid &&
        !canHaveMultipleSelection &&
        Array.isArray(model) &&
        model.length > 1
      ) {
        throw new Error(
          [
            'MUI X: `rowSelectionModel` can only contain 1 item in DataGrid.',
            'You need to upgrade to DataGridPro or DataGridPremium component to unlock multiple selection.',
          ].join('\n'),
        );
      }
      const currentModel = gridRowSelectionStateSelector(apiRef.current.state);
      if (currentModel !== model) {
        logger.debug(`Setting selection model`);
        apiRef.current.setState((state) => ({
          ...state,
          rowSelection: props.rowSelection ? model : [],
        }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, logger, props.rowSelection, props.signature, canHaveMultipleSelection],
  );

  const isRowSelected = React.useCallback<GridRowSelectionApi['isRowSelected']>(
    (id) => gridRowSelectionStateSelector(apiRef.current.state).includes(id),
    [apiRef],
  );

  const isRowSelectable = React.useCallback<GridRowSelectionApi['isRowSelectable']>(
    (id) => {
      if (propIsRowSelectable && !propIsRowSelectable(apiRef.current.getRowParams(id))) {
        return false;
      }

      const rowNode = apiRef.current.getRowNode(id);
      if (rowNode?.type === 'footer' || rowNode?.type === 'pinnedRow') {
        return false;
      }

      return true;
    },
    [apiRef, propIsRowSelectable],
  );

  const getSelectedRows = React.useCallback<GridRowSelectionApi['getSelectedRows']>(
    () => selectedGridRowsSelector(apiRef),
    [apiRef],
  );

  const selectRow = React.useCallback<GridRowSelectionApi['selectRow']>(
    (id, isSelected = true, resetSelection = false) => {
      if (!apiRef.current.isRowSelectable(id)) {
        return;
      }

      lastRowToggled.current = id;

      if (resetSelection) {
        logger.debug(`Setting selection for row ${id}`);

        const newSelection: GridRowId[] = [];
        if (isSelected) {
          newSelection.push(id);
          if (props.propagateRowSelection) {
            const rowsToSelect = findRowsToSelect(apiRef, tree, id);
            rowsToSelect.forEach((rowId) => {
              newSelection.push(rowId);
            });
          }
        }

        apiRef.current.setRowSelectionModel(newSelection);
      } else {
        logger.debug(`Toggling selection for row ${id}`);

        const selection = gridRowSelectionStateSelector(apiRef.current.state);

        const newSelection: Set<GridRowId> = new Set(selection);
        newSelection.delete(id);

        if (isSelected) {
          newSelection.add(id);
          if (props.propagateRowSelection) {
            const rowsToSelect = findRowsToSelect(apiRef, tree, id);
            rowsToSelect.forEach(newSelection.add, newSelection);
          }
        } else if (props.propagateRowSelection) {
          const rowsToDeselect = findRowsToDeselect(apiRef, tree, id);
          rowsToDeselect.forEach((parentId) => {
            newSelection.delete(parentId);
          });
        }

        const isSelectionValid = newSelection.size < 2 || canHaveMultipleSelection;
        if (isSelectionValid) {
          apiRef.current.setRowSelectionModel(Array.from(newSelection));
        }
      }
    },
    [apiRef, logger, canHaveMultipleSelection, tree, props.propagateRowSelection],
  );

  const selectRows = React.useCallback<GridRowMultiSelectionApi['selectRows']>(
    (ids: GridRowId[], isSelected = true, resetSelection = false) => {
      logger.debug(`Setting selection for several rows`);

      const selectableIds = ids.filter((id) => apiRef.current.isRowSelectable(id));

      let newSelection: GridRowId[];
      if (resetSelection) {
        if (isSelected) {
          newSelection = selectableIds;
          if (props.propagateRowSelection) {
            selectableIds.forEach((id) => {
              const rowsToSelect = findRowsToSelect(apiRef, tree, id);
              rowsToSelect.forEach((rowId) => {
                newSelection.push(rowId);
              });
            });
          }
        } else {
          newSelection = [];
        }
      } else {
        // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
        const selectionLookup = {
          ...selectedIdsLookupSelector(apiRef),
        };

        selectableIds.forEach((id) => {
          if (isSelected) {
            selectionLookup[id] = id;
            if (props.propagateRowSelection) {
              const rowsToSelect = findRowsToSelect(apiRef, tree, id);
              rowsToSelect.forEach((rowId) => {
                selectionLookup[rowId] = rowId;
              });
            }
          } else {
            delete selectionLookup[id];
            if (props.propagateRowSelection) {
              const rowsToDeselect = findRowsToDeselect(apiRef, tree, id);
              rowsToDeselect.forEach((parentId) => {
                delete selectionLookup[parentId];
              });
            }
          }
        });

        newSelection = Object.values(selectionLookup);
      }

      const isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;
      if (isSelectionValid) {
        apiRef.current.setRowSelectionModel(newSelection);
      }
    },
    [apiRef, logger, canHaveMultipleSelection, props.propagateRowSelection, tree],
  );

  const selectRowRange = React.useCallback<GridRowMultiSelectionApi['selectRowRange']>(
    (
      {
        startId,
        endId,
      }: {
        startId: GridRowId;
        endId: GridRowId;
      },
      isSelected = true,
      resetSelection = false,
    ) => {
      if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
        return;
      }

      logger.debug(`Expanding selection from row ${startId} to row ${endId}`);

      // Using rows from all pages allow to select a range across several pages
      const allPagesRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const startIndex = allPagesRowIds.indexOf(startId);
      const endIndex = allPagesRowIds.indexOf(endId);
      const [start, end] = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex];
      const rowsBetweenStartAndEnd = allPagesRowIds.slice(start, end + 1);
      apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
    },
    [apiRef, logger],
  );

  const selectionPublicApi: GridRowSelectionApi = {
    selectRow,
    setRowSelectionModel,
    getSelectedRows,
    isRowSelected,
    isRowSelectable,
  };

  const selectionPrivateApi: GridRowMultiSelectionApi = {
    selectRows,
    selectRowRange,
  };

  useGridApiMethod(apiRef, selectionPublicApi, 'public');
  useGridApiMethod(
    apiRef,
    selectionPrivateApi,
    props.signature === GridSignature.DataGrid ? 'private' : 'public',
  );

  const removeOutdatedSelection = React.useCallback(() => {
    if (props.keepNonExistentRowsSelected) {
      return;
    }
    const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);
    const rowsLookup = gridRowsLookupSelector(apiRef);

    // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
    const selectionLookup = { ...selectedIdsLookupSelector(apiRef) };

    let hasChanged = false;
    currentSelection.forEach((id: GridRowId) => {
      if (!rowsLookup[id]) {
        delete selectionLookup[id];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      apiRef.current.setRowSelectionModel(Object.values(selectionLookup));
    }
  }, [apiRef, props.keepNonExistentRowsSelected]);

  const handleSingleRowSelection = React.useCallback(
    (id: GridRowId, event: React.MouseEvent | React.KeyboardEvent) => {
      const hasCtrlKey = event.metaKey || event.ctrlKey;

      // multiple selection is only allowed if:
      // - it is a checkboxSelection
      // - it is a keyboard selection
      // - Ctrl is pressed

      const isMultipleSelectionDisabled =
        !checkboxSelection && !hasCtrlKey && !isKeyboardEvent(event);
      const resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;

      const isSelected = apiRef.current.isRowSelected(id);

      if (resetSelection) {
        apiRef.current.selectRow(id, !isMultipleSelectionDisabled ? !isSelected : true, true);
      } else {
        apiRef.current.selectRow(id, !isSelected, false);
      }
    },
    [apiRef, canHaveMultipleSelection, checkboxSelection],
  );

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params, event) => {
      if (disableRowSelectionOnClick) {
        return;
      }

      const field = (event.target as HTMLDivElement)
        .closest(`.${gridClasses.cell}`)
        ?.getAttribute('data-field');

      if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        // click on checkbox should not trigger row selection
        return;
      }

      if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        // click to open the detail panel should not select the row
        return;
      }

      if (field) {
        const column = apiRef.current.getColumn(field);

        if (column?.type === GRID_ACTIONS_COLUMN_TYPE) {
          return;
        }
      }

      const rowNode = apiRef.current.getRowNode(params.id);
      if (rowNode!.type === 'pinnedRow') {
        return;
      }

      if (event.shiftKey && canHaveMultipleSelection) {
        expandMouseRowRangeSelection(params.id);
      } else {
        handleSingleRowSelection(params.id, event);
      }
    },
    [
      disableRowSelectionOnClick,
      canHaveMultipleSelection,
      apiRef,
      expandMouseRowRangeSelection,
      handleSingleRowSelection,
    ],
  );

  const preventSelectionOnShift = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      if (canHaveMultipleSelection && event.shiftKey) {
        window.getSelection()?.removeAllRanges();
      }
    },
    [canHaveMultipleSelection],
  );

  const handleRowSelectionCheckboxChange = React.useCallback<
    GridEventListener<'rowSelectionCheckboxChange'>
  >(
    (params, event) => {
      if (canHaveMultipleSelection && (event.nativeEvent as any).shiftKey) {
        expandMouseRowRangeSelection(params.id);
      } else {
        apiRef.current.selectRow(params.id, params.value, !canHaveMultipleSelection);
      }
    },
    [apiRef, expandMouseRowRangeSelection, canHaveMultipleSelection],
  );

  const handleHeaderSelectionCheckboxChange = React.useCallback<
    GridEventListener<'headerSelectionCheckboxChange'>
  >(
    (params) => {
      const shouldLimitSelectionToCurrentPage =
        props.checkboxSelectionVisibleOnly && props.pagination;

      const rowsToBeSelected = shouldLimitSelectionToCurrentPage
        ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef)
        : gridExpandedSortedRowIdsSelector(apiRef);

      const filterModel = gridFilterModelSelector(apiRef);
      apiRef.current.selectRows(rowsToBeSelected, params.value, filterModel?.items.length > 0);
    },
    [apiRef, props.checkboxSelectionVisibleOnly, props.pagination],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      // Get the most recent cell mode because it may have been changed by another listener
      if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
        return;
      }

      // Ignore portal
      // Do not apply shortcuts if the focus is not on the cell root component
      if (isEventTargetInPortal(event)) {
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        // The cell that has focus after the keyboard navigation
        const focusCell = gridFocusCellSelector(apiRef);
        if (focusCell && focusCell.id !== params.id) {
          event.preventDefault();

          const isNextRowSelected = apiRef.current.isRowSelected(focusCell.id);
          if (!canHaveMultipleSelection) {
            apiRef.current.selectRow(focusCell.id, !isNextRowSelected, true);
            return;
          }

          const newRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(focusCell.id);
          const previousRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

          let start: number;
          let end: number;

          if (newRowIndex > previousRowIndex) {
            if (isNextRowSelected) {
              // We are navigating to the bottom of the page and adding selected rows
              start = previousRowIndex;
              end = newRowIndex - 1;
            } else {
              // We are navigating to the bottom of the page and removing selected rows
              start = previousRowIndex;
              end = newRowIndex;
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isNextRowSelected) {
              // We are navigating to the top of the page and removing selected rows
              start = newRowIndex + 1;
              end = previousRowIndex;
            } else {
              // We are navigating to the top of the page and adding selected rows
              start = newRowIndex;
              end = previousRowIndex;
            }
          }

          const rowsBetweenStartAndEnd = visibleRows.rows
            .slice(start, end + 1)
            .map((row) => row.id);
          apiRef.current.selectRows(rowsBetweenStartAndEnd, !isNextRowSelected);
          return;
        }
      }

      if (event.key === ' ' && event.shiftKey) {
        event.preventDefault();
        handleSingleRowSelection(params.id, event);
        return;
      }

      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        selectRows(apiRef.current.getAllRowIds(), true);
      }
    },
    [apiRef, handleSingleRowSelection, selectRows, visibleRows.rows, canHaveMultipleSelection],
  );

  const handleRowPropagation = React.useCallback(() => {
    if (!props.propagateRowSelection) {
      return;
    }
    const filteredRows = gridFilteredSortedRowIdsSelector(apiRef);
    const selectedRows = selectedGridRowsSelector(apiRef);
    const newSelectedRows: GridRowId[] = [];
    selectedRows.forEach((row) => {
      if (filteredRows.includes(row?.id) && tree[row.id].type !== 'group') {
        newSelectedRows.push(row.id);
      }
    });
    apiRef.current.selectRows(newSelectedRows, true, true);
  }, [apiRef, props.propagateRowSelection, tree]);

  useGridApiEventHandler(
    apiRef,
    'sortedRowsSet',
    runIfRowSelectionIsEnabled(removeOutdatedSelection),
  );
  useGridApiEventHandler(apiRef, 'rowClick', runIfRowSelectionIsEnabled(handleRowClick));
  useGridApiEventHandler(
    apiRef,
    'rowSelectionCheckboxChange',
    runIfRowSelectionIsEnabled(handleRowSelectionCheckboxChange),
  );
  useGridApiEventHandler(
    apiRef,
    'headerSelectionCheckboxChange',
    handleHeaderSelectionCheckboxChange,
  );
  useGridApiEventHandler(
    apiRef,
    'cellMouseDown',
    runIfRowSelectionIsEnabled(preventSelectionOnShift),
  );
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfRowSelectionIsEnabled(handleCellKeyDown));
  useGridApiEventHandler(
    apiRef,
    'filteredRowsSet',
    runIfRowSelectionIsEnabled(handleRowPropagation),
  );

  React.useEffect(() => {
    if (propRowSelectionModel !== undefined) {
      apiRef.current.setRowSelectionModel(propRowSelectionModel);
    }
  }, [apiRef, propRowSelectionModel, props.rowSelection]);

  React.useEffect(() => {
    if (!props.rowSelection) {
      apiRef.current.setRowSelectionModel([]);
    }
  }, [apiRef, props.rowSelection]);

  const isStateControlled = propRowSelectionModel != null;
  React.useEffect(() => {
    if (isStateControlled || !props.rowSelection) {
      return;
    }

    // props.isRowSelectable changed
    const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);

    if (isRowSelectable) {
      const newSelection = currentSelection.filter((id) => isRowSelectable(id));

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setRowSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, isStateControlled, props.rowSelection]);

  React.useEffect(() => {
    if (!props.rowSelection || isStateControlled) {
      return;
    }

    const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);
    if (!canHaveMultipleSelection && currentSelection.length > 1) {
      // See https://github.com/mui/mui-x/issues/8455
      apiRef.current.setRowSelectionModel([]);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection, isStateControlled, props.rowSelection]);

  React.useEffect(() => {
    // TODO v8: Remove when `propagateRowSelection` is the default behavior
    if (props.propagateRowSelection) {
      runIfRowSelectionIsEnabled(handleRowPropagation);
    }
  }, [handleRowPropagation, props.propagateRowSelection, runIfRowSelectionIsEnabled]);
};
