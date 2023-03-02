import type {
  GridColDef,
  GridSingleSelectColDef,
  GridMultipleSelectColDef,
  ValueOptions,
} from '../../../models/colDef/gridColDef';

export function isSingleSelectColDef(colDef: GridColDef | null): colDef is GridSingleSelectColDef {
  return colDef?.type === 'singleSelect';
}

export function isMultipleSelectColDef(
  colDef: GridColDef | null,
): colDef is GridMultipleSelectColDef {
  return colDef?.type === 'multipleSelect';
}

export function getValueFromValueOptions(
  value: string,
  valueOptions: any[] | undefined,
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>,
) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });
  return getOptionValue(result);
}

export function getValuesFromValueOptions(
  values: string[],
  valueOptions: any[] | undefined,
  getOptionValue: NonNullable<GridMultipleSelectColDef['getOptionValue']>,
) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const valuesStrings = values.map((value) => String(value));
  const result = valueOptions.filter((option) => {
    const optionValue = getOptionValue(option);
    return valuesStrings.includes(String(optionValue));
  });
  console.log('getValuesFromValueOptions result', result);
  return result.map((option) => getOptionValue(option));
}

export const getLabelFromValueOption = (valueOption: ValueOptions) => {
  const label = typeof valueOption === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};
