import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useSplitFieldProps, useParsedFormat } from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

function CustomDateField(props: DatePickerFieldProps) {
  // TextField does not support slots and slotProps before `@mui/material` v6.0
  const { slots, slotProps, ...other } = props;
  const { internalProps, forwardedProps } = useSplitFieldProps(other, 'date');

  const { format, timezone, value, onChange } = internalProps;
  const [inputValue, setInputValue] = useInputValue(value, format);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value,
    timezone,
    props: internalProps,
    validator: validateDate,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, format);
    setInputValue(newInputValue);
    onChange(newValue, { validationError: getValidationErrorForNewValue(newValue) });
  };

  const placeholder = useParsedFormat(internalProps);

  return (
    <TextField
      {...forwardedProps}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      error={hasValidationError}
    />
  );
}

function useInputValue(valueProp: Dayjs | null, format: string) {
  const [lastValueProp, setLastValueProp] = React.useState(valueProp);
  const [inputValue, setInputValue] = React.useState(() =>
    createInputValue(valueProp, format),
  );

  if (lastValueProp !== valueProp) {
    setLastValueProp(valueProp);
    if (valueProp && valueProp.isValid()) {
      setInputValue(createInputValue(valueProp, format));
    }
  }

  return [inputValue, setInputValue] as const;
}

function createInputValue(value: Dayjs | null, format: string) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function CustomFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker slots={{ ...props.slots, field: CustomDateField }} {...props} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomFieldDatePicker />
    </LocalizationProvider>
  );
}
