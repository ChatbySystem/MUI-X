import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function DateTimeFieldValue() {
  const [value, setValue] = React.useState(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DateTimeField
          label="Uncontrolled field"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <DateTimeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
