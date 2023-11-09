import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';
import { isObject } from '../utils/utils';
import { convertLegacyOperators } from './utils';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

export const getGridSingleSelectOperators = () =>
  convertLegacyOperators([
    {
      value: 'is',
      getApplyFilterFnV7: (filterItem) => {
        if (filterItem.value == null || filterItem.value === '') {
          return null;
        }
        return (value): boolean => parseObjectValue(value) === parseObjectValue(filterItem.value);
      },
      InputComponent: GridFilterInputSingleSelect,
    },
    {
      value: 'not',
      getApplyFilterFnV7: (filterItem) => {
        if (filterItem.value == null || filterItem.value === '') {
          return null;
        }
        return (value): boolean => parseObjectValue(value) !== parseObjectValue(filterItem.value);
      },
      InputComponent: GridFilterInputSingleSelect,
    },
    {
      value: 'isAnyOf',
      getApplyFilterFnV7: (filterItem) => {
        if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
          return null;
        }
        const filterItemValues = filterItem.value.map(parseObjectValue);
        return (value): boolean => filterItemValues.includes(parseObjectValue(value));
      },
      InputComponent: GridFilterInputMultipleSingleSelect,
    },
  ] as const satisfies ReadonlyArray<Omit<GridFilterOperator, 'getApplyFilterFn'>>);
