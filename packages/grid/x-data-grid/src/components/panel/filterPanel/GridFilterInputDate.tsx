import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { Theme } from '@mui/material/styles';
import { unstable_useId as useId } from '@mui/utils';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridDensity } from '../../../models/gridDensity';

export type GridFilterInputDateProps = GridFilterInputValueProps &
  TextFieldProps & {
    type?: 'date' | 'datetime-local';
    clearButton?: React.ReactNode | null;
    gridDensity?: GridDensity;
  };

const compactDensitySx = (theme: Theme) => {
  return {
    [`& input`]: {
      fontSize: theme.typography.fontSize,
      padding: '0 0 2px',
    },
    [`& label`]: {
      fontSize: theme.typography.fontSize,
    },
  };
};

export const SUBMIT_FILTER_DATE_STROKE_TIME = 500;

function GridFilterInputDate(props: GridFilterInputDateProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    InputProps,
    clearButton,
    tabIndex,
    disabled,
    gridDensity,
    sx,
    ...other
  } = props;
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      clearTimeout(filterTimeout.current);
      setFilterValueState(String(value));

      setIsApplying(true);
      filterTimeout.current = setTimeout(() => {
        applyValue({ ...item, value });
        setIsApplying(false);
      }, SUBMIT_FILTER_DATE_STROKE_TIME);
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);

  return (
    <rootProps.slots.baseTextField
      fullWidth
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      size={gridDensity === 'compact' ? 'small' : 'normal'}
      variant="standard"
      type={type || 'text'}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      InputProps={{
        ...(applying || clearButton
          ? {
              endAdornment: applying ? (
                <rootProps.slots.loadIcon fontSize="small" color="action" />
              ) : (
                clearButton
              ),
            }
          : {}),
        disabled,
        ...InputProps,
        inputProps: {
          max: type === 'datetime-local' ? '9999-12-31T23:59' : '9999-12-31',
          tabIndex,
          ...InputProps?.inputProps,
        },
      }}
      sx={gridDensity === 'compact' ? [compactDensitySx, sx] : sx}
      {...other}
      {...rootProps.slotProps?.baseTextField}
    />
  );
}

GridFilterInputDate.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  clearButton: PropTypes.node,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (e.g. `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputDate };
