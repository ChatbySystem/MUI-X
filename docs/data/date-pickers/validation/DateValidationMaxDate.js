import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');

export default function DateValidationMaxDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        content={['NextDatePicker', 'NextDateRangePicker', 'NextDateTimePicker']}
      >
        <DemoItem label="DatePicker" content={['NextDatePicker']}>
          <NextDatePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker" content={['NextDateTimePicker']}>
          <NextDateTimePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker" content={['NextDateRangePicker']}>
          <NextDateRangePicker
            defaultValue={[yesterday, today]}
            maxDate={yesterday}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
