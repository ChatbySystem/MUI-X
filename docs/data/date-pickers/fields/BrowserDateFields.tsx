import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Stack, Box } from '@mui/material';

interface BrowserFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  inputProps?: {
    ref?: React.Ref<any>;
  };
  InputProps?: { endAdornment?: React.ReactNode; startAdornment?: React.ReactNode };
  error?: boolean;
  focused?: boolean;
  ownerState?: any;
  sx?: any;
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      id,
      label,
      inputProps: { ref: inputRef } = {},
      InputProps: { startAdornment, endAdornment } = {},
      ...other
    } = props;

    return (
      <form
        id={id}
        style={{
          flexGrow: 1,
        }}
      >
        <label>{label}</label>
        <Box
          ref={ref}
          sx={{ ...other?.sx, display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          {startAdornment}
          <input disabled={disabled} {...other} ref={inputRef} />
          {endAdornment}
        </Box>
      </form>
    );
  },
) as BrowserFieldComponent;

export default function BrowserDateFields() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'TimeField']}>
        <Stack spacing={2}>
          <DemoItem>
            <DateField
              label="Browser date field"
              clearable
              slots={{
                textField: BrowserField,
              }}
              sx={{ width: '300px' }}
            />
          </DemoItem>

          <DemoItem>
            <TimeField
              label="Browser time field"
              clearable
              slots={{
                textField: BrowserField,
              }}
              sx={{ width: '300px' }}
            />
          </DemoItem>
          <DemoItem>
            <SingleInputDateRangeField
              label="Browser Date Range Field"
              clearable
              slots={{
                textField: BrowserField,
              }}
              sx={{ width: '300px' }}
            />
          </DemoItem>
        </Stack>
      </DemoContainer>
    </LocalizationProvider>
  );
}
