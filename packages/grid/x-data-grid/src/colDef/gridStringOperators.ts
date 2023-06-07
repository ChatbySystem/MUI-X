import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { escapeRegExp } from '../utils/utils';
import type { GridApplyQuickFilterV7 } from '../models/colDef/gridColDef';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { v7 } from './utils';

export const getGridStringQuickFilterFn = v7((value: any): GridApplyQuickFilterV7 | null => {
  if (!value) {
    return null;
  }
  const filterRegex = new RegExp(escapeRegExp(value), 'i');
  return (_, row, column, apiRef): boolean => {
    const columnValue = apiRef.current.getRowFormattedValue(row, column);
    return columnValue != null ? filterRegex.test(columnValue.toString()) : false;
  };
});

export const getGridStringOperators = (
  disableTrim: boolean = false,
): GridFilterOperator<any, number | string | null, any>[] => [
  {
    value: 'contains',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(escapeRegExp(filterItemValue), 'i');
      return (value, _, __, ___): boolean => {
        return value != null ? filterRegex.test(String(value)) : false;
      };
    }),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'equals',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
      return (value, _, __, ___): boolean => {
        return value != null ? collator.compare(filterItemValue, value.toString()) === 0 : false;
      };
    }),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`^${escapeRegExp(filterItemValue)}.*$`, 'i');
      return (value, _, __, ___): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    }),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'endsWith',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`.*${escapeRegExp(filterItemValue)}$`, 'i');
      return (value, _, __, ___): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    }),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: v7(() => {
      return (value, _, __, ___): boolean => {
        return value === '' || value == null;
      };
    }),
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: v7(() => {
      return (value, _, __, ___): boolean => {
        return value !== '' && value != null;
      };
    }),
    requiresFilterValue: false,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterItemValue = disableTrim
        ? filterItem.value
        : filterItem.value.map((val) => val.trim());
      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });

      return (value, _, __, ___): boolean =>
        value != null
          ? filterItemValue.some((filterValue: GridFilterItem['value']) => {
              return collator.compare(filterValue, value.toString() || '') === 0;
            })
          : false;
    }),
    InputComponent: GridFilterInputMultipleValue,
  },
];
