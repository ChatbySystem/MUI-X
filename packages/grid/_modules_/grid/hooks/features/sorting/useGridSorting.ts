import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridCellValue } from '../../../models/gridCell';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { GridRowId, GridRowIdTree } from '../../../models/gridRows';
import {
  GridFieldComparatorList,
  GridSortItem,
  GridSortModel,
  GridSortDirection,
  GridSortCellParams,
} from '../../../models/gridSortModel';
import { isDesc, nextGridSortDirection } from '../../../utils/sortingUtils';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../core/useGridState';
import {
  gridSortedRowIdsSelector,
  gridSortedRowIdsFlatSelector,
  gridSortedRowsSelector,
} from './gridSortingSelector';
import { gridRowTreeSelector } from '../rows';
import { GridSortedRowsIdTreeNode } from './gridSortingState';

/**
 * @requires useGridRows (state, event)
 * @requires useGridControlState (method)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'sortModel'
    | 'onSortModelChange'
    | 'sortingOrder'
    | 'sortingMode'
    | 'disableMultipleColumnsSorting'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridSorting');

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: GridSortItem): GridSortModel => {
      const existingIdx = gridState.sorting.sortModel.findIndex((c) => c.field === field);
      let newSortModel = [...gridState.sorting.sortModel];
      if (existingIdx > -1) {
        if (!sortItem) {
          newSortModel.splice(existingIdx, 1);
        } else {
          newSortModel.splice(existingIdx, 1, sortItem);
        }
      } else {
        newSortModel = [...gridState.sorting.sortModel, sortItem!];
      }
      return newSortModel;
    },
    [gridState.sorting.sortModel],
  );

  const createSortItem = React.useCallback(
    (col: GridColDef, directionOverride?: GridSortDirection): GridSortItem | undefined => {
      const existing = gridState.sorting.sortModel.find((c) => c.field === col.field);

      if (existing) {
        const nextSort =
          directionOverride === undefined
            ? nextGridSortDirection(props.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? nextGridSortDirection(props.sortingOrder)
            : directionOverride,
      };
    },
    [gridState.sorting.sortModel, props.sortingOrder],
  );

  const getSortCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const params: GridSortCellParams = {
        id,
        field,
        value: apiRef.current.getCellValue(id, field),
        api: apiRef.current,
      };

      return params;
    },
    [apiRef],
  );

  const comparatorListAggregate = React.useCallback(
    (comparatorList: GridFieldComparatorList) =>
      (row1: GridSortCellParams[], row2: GridSortCellParams[]) => {
        return comparatorList.reduce((res, colComparator, index) => {
          if (res !== 0) {
            return res;
          }

          const { comparator } = colComparator;
          const sortCellParams1 = row1[index];
          const sortCellParams2 = row2[index];
          res = comparator(
            sortCellParams1.value,
            sortCellParams2.value,
            sortCellParams1,
            sortCellParams2,
          );
          return res;
        }, 0);
      },
    [],
  );

  const buildComparatorList = React.useCallback(
    (sortModel: GridSortModel): GridFieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const column = apiRef.current.getColumn(item.field);
        if (!column) {
          throw new Error(`Error sorting: column with field '${item.field}' not found. `);
        }
        const comparator = isDesc(item.sort)
          ? (
              v1: GridCellValue,
              v2: GridCellValue,
              cellParams1: GridSortCellParams,
              cellParams2: GridSortCellParams,
            ) => -1 * column.sortComparator!(v1, v2, cellParams1, cellParams2)
          : column.sortComparator!;
        return { field: column.field, comparator };
      });
      return comparators;
    },
    [apiRef],
  );

  const applySorting = React.useCallback(() => {
    const unsortedRowTree = gridRowTreeSelector(apiRef.current.state);

    const skipServerSorting = props.sortingMode === GridFeatureModeConstant.server;

    if (skipServerSorting) {
      logger.debug('Skipping sorting rows as sortingMode = server');
    }

    const sortModel = apiRef.current.state.sorting.sortModel;
    const comparatorList = buildComparatorList(sortModel);
    const aggregatedComparator = comparatorListAggregate(comparatorList);

    const sortRowTree = (tree: GridRowIdTree): GridSortedRowsIdTreeNode[] => {
      const rowsWithParams = Array.from(tree.entries()).map(([name, value]) => {
        const params = comparatorList.map((colComparator) =>
          getSortCellParams(value.id, colComparator.field),
        );

        return { value, name, params };
      });

      const sortedRowsWithParams = skipServerSorting
        ? rowsWithParams
        : rowsWithParams.sort((a, b) => aggregatedComparator(a.params, b.params));

      return sortedRowsWithParams.map((node) => ({
        id: node.value.id,
        children: sortRowTree(node.value.children),
      }));
    };
    const sortedRows = sortRowTree(unsortedRowTree);

    setGridState((state) => {
      return {
        ...state,
        sorting: { ...state.sorting, sortedRows },
      };
    });
    forceUpdate();
  }, [
    apiRef,
    logger,
    getSortCellParams,
    setGridState,
    forceUpdate,
    buildComparatorList,
    comparatorListAggregate,
    props.sortingMode,
  ]);

  const setSortModel = React.useCallback(
    (sortModel: GridSortModel) => {
      setGridState((state) => {
        return { ...state, sorting: { ...state.sorting, sortModel } };
      });
      forceUpdate();
      apiRef.current.applySorting();
    },
    [setGridState, forceUpdate, apiRef],
  );

  const sortColumn = React.useCallback(
    (column: GridColDef, direction?: GridSortDirection, allowMultipleSorting?: boolean) => {
      if (!column.sortable) {
        return;
      }
      const sortItem = createSortItem(column, direction);
      let sortModel: GridSortItem[];
      if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
        sortModel = !sortItem ? [] : [sortItem];
      } else {
        sortModel = upsertSortModel(column.field, sortItem);
      }
      setSortModel(sortModel);
    },
    [upsertSortModel, setSortModel, createSortItem, props.disableMultipleColumnsSorting],
  );

  const getSortModel = React.useCallback(
    () => gridState.sorting.sortModel,
    [gridState.sorting.sortModel],
  );

  const getSortedRows = React.useCallback<GridSortApi['getSortedRows']>(
    () => gridSortedRowsSelector(apiRef.current.state),
    [apiRef],
  );

  const getSortedRowIds = React.useCallback<GridSortApi['getSortedRowIds']>(
    () => gridSortedRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const getFlatSortedRowIds = React.useCallback<GridSortApi['getFlatSortedRowIds']>(
    () => gridSortedRowIdsFlatSelector(apiRef.current.state),
    [apiRef],
  );

  const sortApi: GridSortApi = {
    getSortModel,
    getSortedRows,
    getSortedRowIds,
    getFlatSortedRowIds,
    setSortModel,
    sortColumn,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'GridSortApi');

  React.useEffect(() => {
    apiRef.current.updateControlState<GridSortModel>({
      stateId: 'sortModel',
      propModel: props.sortModel,
      propOnChange: props.onSortModelChange,
      stateSelector: (state) => state.sorting.sortModel,
      changeEvent: GridEvents.sortModelChange,
    });
  }, [apiRef, props.sortModel, props.onSortModelChange]);

  React.useEffect(() => {
    const oldSortModel = apiRef.current.state.sorting.sortModel;
    if (props.sortModel !== undefined && props.sortModel !== oldSortModel) {
      setSortModel(props.sortModel);
    }
  }, [props.sortModel, apiRef, setSortModel]);

  const handleColumnHeaderClick = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.MouseEvent) => {
      const allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
      sortColumn(colDef, undefined, allowMultipleSorting);
    },
    [sortColumn],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.KeyboardEvent) => {
      // CTRL + Enter opens the column menu
      if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
        sortColumn(colDef, undefined, event.shiftKey);
      }
    },
    [sortColumn],
  );

  const onColUpdated = React.useCallback(() => {
    // When the columns change we check that the sorted columns are still part of the dataset
    setGridState((state) => {
      const sortModel = state.sorting.sortModel;
      const latestColumns = allGridColumnsSelector(state);
      let newModel = sortModel;
      if (sortModel.length > 0) {
        newModel = sortModel.reduce((model, sortedCol) => {
          const exist = latestColumns.find((col) => col.field === sortedCol.field);
          if (exist) {
            model.push(sortedCol);
          }
          return model;
        }, [] as GridSortModel);
      }

      return { ...state, sorting: { ...state.sorting, sortModel: newModel } };
    });
  }, [setGridState]);

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);
};
