import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const today = dayjs();

const isInCurrentMonth = (date: Dayjs) => date.get('month') === dayjs().get('month');

export default function DateValidationShouldDisableMonth() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={["NextDatePicker", "NextDateTimePicker"]}>
        <DemoItem label="DatePicker" content={["NextDatePicker"]}>
          <NextDatePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker" content={["NextDateTimePicker"]}>
          <NextDateTimePicker
            defaultValue={today}
            shouldDisableMonth={isInCurrentMonth}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
