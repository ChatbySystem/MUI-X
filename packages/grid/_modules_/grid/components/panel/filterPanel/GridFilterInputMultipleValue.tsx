import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import TextField from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridFilterItem } from '../../../models/gridFilterItem';

export interface GridFilterInputMultipleValueProps {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: any;
  focusElementRef?: React.Ref<any>;
}

export interface GridTypeFilterInputMultipleValueProps extends GridFilterInputMultipleValueProps {
  type?: 'text' | 'number' | 'singleSelect';
}

const getSingleSelectOptionFormatter =
  ({ valueFormatter, field }, api) =>
  (option) => {
    if (typeof option === 'object') {
      return option.label;
    }
    return valueFormatter && option !== '' ? valueFormatter({ value: option, field, api }) : option;
  };

const filter = createFilterOptions<any>();

function GridFilterInputMultipleValue(
  props: GridTypeFilterInputMultipleValueProps &
    Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>,
) {
  const { item, applyValue, type, apiRef, focusElementRef, ...other } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = useId();

  const filterValueOptionFormater =
    type === 'singleSelect'
      ? getSingleSelectOptionFormatter(apiRef.current.getColumn(item.columnField), apiRef.current)
      : (x) => x;
  const filterValueParser = React.useCallback(
    // Whatever is the input, we convert its value to a string
    (value) => {
      if (type === 'singleSelect') {
        return String(typeof value === 'object' ? value.value : value);
      }
      return String(value);
    },
    [type],
  );

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(filterValueParser));
  }, [item.value, filterValueParser]);

  const isOptionEqualToValue = React.useCallback(
    (option, value) => filterValueParser(option) === String(value),
    [filterValueParser],
  );

  const onFilterChange = React.useCallback(
    (event, value) => {
      const parsedValue = value.map(filterValueParser);
      setFilterValueState(parsedValue);
      applyValue({ ...item, value: [...parsedValue] });
    },
    [applyValue, item, filterValueParser],
  );

  return (
    <Autocomplete
      multiple
      freeSolo={type !== 'singleSelect'}
      limitTags={1}
      options={
        type === 'singleSelect' ? apiRef.current.getColumn(item.columnField).valueOptions : []
      }
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (type === 'singleSelect') {
          return filtered;
        }

        const { inputValue } = params;
        return inputValue == null || inputValue === '' ? [] : [inputValue];
      }}
      id={id}
      value={filterValueState}
      onChange={onFilterChange}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            size="small"
            label={filterValueOptionFormater(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
          placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          inputRef={focusElementRef}
          type={type || 'text'}
          variant="standard"
        />
      )}
      {...other}
    />
  );
}

GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any.isRequired,
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputMultipleValue };
