import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function LifeCycleIgnoreInvalidValue() {
  const [value, setValue] = React.useState<SimpleValue>(null);

  return (
    <Stack spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={(newValue, context) => {
            if (context.validationError == null) {
              setValue(newValue);
            }
          }}
          minDate={dayjs('2022-01-01')}
          maxDate={dayjs('2022-12-31')}
        />
      </LocalizationProvider>
      <Typography>
        Value: {value == null ? 'null' : (value as Dayjs).format('L')}
      </Typography>
    </Stack>
  );
}
