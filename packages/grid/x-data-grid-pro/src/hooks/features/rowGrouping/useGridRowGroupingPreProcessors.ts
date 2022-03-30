import * as React from 'react';
import {
  gridColumnLookupSelector,
  GridKeyValue,
  GridRowId,
  gridRowIdsSelector,
  GridRowModel,
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  GridColumnRawLookup,
  GridPipeProcessor,
  GridHydrateColumnsValue,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
} from './gridRowGroupingSelector';
import {
  createGroupingColDefForAllGroupingCriteria,
  createGroupingColDefForOneGroupingCriteria,
} from './createGroupingColDef';
import {
  filterRowTreeFromGroupingColumns,
  getColDefOverrides,
  ROW_GROUPING_STRATEGY,
  isGroupingColumn,
  setStrategyAvailability,
} from './gridRowGroupingUtils';
import { GridApiPro } from '../../../models/gridApiPro';
import { GridGroupingValueGetterParams } from '../../../models/gridGroupingValueGetterParams';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import { sortRowTree } from '../../../utils/tree/sortRowTree';

export const useGridRowGroupingPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'disableRowGrouping'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
  >,
) => {
  const getGroupingColDefs = React.useCallback(
    (columnsState: GridHydrateColumnsValue) => {
      if (props.disableRowGrouping) {
        return [];
      }

      const groupingColDefProp = props.groupingColDef;

      // We can't use `gridGroupingRowsSanitizedModelSelector` here because the new columns are not in the state yet
      const rowGroupingModel = gridRowGroupingModelSelector(apiRef).filter(
        (field) => !!columnsState.lookup[field],
      );

      if (rowGroupingModel.length === 0) {
        return [];
      }

      switch (props.rowGroupingColumnMode) {
        case 'single': {
          return [
            createGroupingColDefForAllGroupingCriteria({
              apiRef,
              rowGroupingModel,
              colDefOverride: getColDefOverrides(groupingColDefProp, rowGroupingModel),
              columnsLookup: columnsState.lookup,
            }),
          ];
        }

        case 'multiple': {
          return rowGroupingModel.map((groupingCriteria) =>
            createGroupingColDefForOneGroupingCriteria({
              groupingCriteria,
              colDefOverride: getColDefOverrides(groupingColDefProp, [groupingCriteria]),
              groupedByColDef: columnsState.lookup[groupingCriteria],
              columnsLookup: columnsState.lookup,
            }),
          );
        }

        default: {
          return [];
        }
      }
    },
    [apiRef, props.groupingColDef, props.rowGroupingColumnMode, props.disableRowGrouping],
  );

  const updateGroupingColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const groupingColDefs = getGroupingColDefs(columnsState);
      let newColumnFields: string[] = [];
      const newColumnsLookup: GridColumnRawLookup = {};

      // We only keep the non-grouping columns
      columnsState.all.forEach((field) => {
        if (!isGroupingColumn(field)) {
          newColumnFields.push(field);
          newColumnsLookup[field] = columnsState.lookup[field];
        }
      });

      // We add the grouping column
      groupingColDefs.forEach((groupingColDef) => {
        const matchingGroupingColDef = columnsState.lookup[groupingColDef.field];
        if (matchingGroupingColDef) {
          groupingColDef.width = matchingGroupingColDef.width;
          groupingColDef.flex = matchingGroupingColDef.flex;
        }

        newColumnsLookup[groupingColDef.field] = groupingColDef;
      });
      const startIndex = newColumnFields[0] === '__check__' ? 1 : 0;
      newColumnFields = [
        ...newColumnFields.slice(0, startIndex),
        ...groupingColDefs.map((colDef) => colDef.field),
        ...newColumnFields.slice(startIndex),
      ];

      columnsState.all = newColumnFields;
      columnsState.lookup = newColumnsLookup;

      return columnsState;
    },
    [getGroupingColDefs],
  );

  const createRowTree = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      apiRef.current.setState((state) => ({
        ...state,
        rowGrouping: {
          ...state.rowGrouping,
          unstable_sanitizedModelOnLastRowTreeCreation: rowGroupingModel,
        },
      }));

      const distinctValues: {
        [field: string]: { lookup: { [val: string]: boolean }; list: any[] };
      } = Object.fromEntries(
        rowGroupingModel.map((groupingField) => [groupingField, { lookup: {}, list: [] }]),
      );

      const getCellGroupingCriteria = ({
        row,
        id,
        colDef,
      }: {
        row: GridRowModel;
        id: GridRowId;
        colDef: GridColDef;
      }) => {
        let key: GridKeyValue | null | undefined;
        if (colDef.groupingValueGetter) {
          const groupingValueGetterParams: GridGroupingValueGetterParams = {
            colDef,
            field: colDef.field,
            value: row[colDef.field],
            id,
            row,
            rowNode: {
              isAutoGenerated: false,
              id,
            },
          };
          key = colDef.groupingValueGetter(groupingValueGetterParams);
        } else {
          key = row[colDef.field] as GridKeyValue | null | undefined;
        }

        return {
          key,
          field: colDef.field,
        };
      };

      params.ids.forEach((rowId) => {
        const row = params.idRowsLookup[rowId];

        rowGroupingModel.forEach((groupingCriteria) => {
          const { key } = getCellGroupingCriteria({
            row,
            id: rowId,
            colDef: columnsLookup[groupingCriteria],
          });
          const groupingFieldsDistinctKeys = distinctValues[groupingCriteria];

          if (key != null && !groupingFieldsDistinctKeys.lookup[key.toString()]) {
            groupingFieldsDistinctKeys.lookup[key.toString()] = true;
            groupingFieldsDistinctKeys.list.push(key);
          }
        });
      });

      const rows = params.ids.map((rowId) => {
        const row = params.idRowsLookup[rowId];
        const parentPath = rowGroupingModel
          .map((groupingField) =>
            getCellGroupingCriteria({
              row,
              id: rowId,
              colDef: columnsLookup[groupingField],
            }),
          )
          .filter((cell) => cell.key != null) as BuildRowTreeGroupingCriteria[];

        const leafGroupingCriteria: BuildRowTreeGroupingCriteria = {
          key: rowId.toString(),
          field: null,
        };

        return {
          path: [...parentPath, leafGroupingCriteria],
          id: rowId,
        };
      });

      return buildRowTree({
        ...params,
        rows,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: ROW_GROUPING_STRATEGY,
      });
    },
    [apiRef, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return filterRowTreeFromGroupingColumns({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
      });
    },
    [apiRef],
  );

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);
      const rowIds = gridRowIdsSelector(apiRef);

      return sortRowTree({
        rowTree,
        rowIds,
        sortRowList: params.sortRowList,
        disableChildrenSorting: false,
      });
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(apiRef, ROW_GROUPING_STRATEGY, 'rowTreeCreation', createRowTree);
  useGridRegisterStrategyProcessor(apiRef, ROW_GROUPING_STRATEGY, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(apiRef, ROW_GROUPING_STRATEGY, 'sorting', sortRows);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    setStrategyAvailability(apiRef, props.disableRowGrouping);
  });

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      setStrategyAvailability(apiRef, props.disableRowGrouping);
    } else {
      isFirstRender.current = false;
    }
  }, [apiRef, props.disableRowGrouping]);
};
