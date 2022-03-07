import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';

const parseObjectValue = (value: GridFilterItem) => {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  return value.value;
};

export const getGridSingleSelectOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => parseObjectValue(value) === parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => parseObjectValue(value) !== parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterItemValues = filterItem.value.map(parseObjectValue);
      return ({ value }): boolean => filterItemValues.includes(parseObjectValue(value));
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
];
