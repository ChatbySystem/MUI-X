import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DateCalendarFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={['DateCalendar']}>
        <DemoItem label="disabled" content={['DateCalendar']}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} disabled />
        </DemoItem>
        <DemoItem label="readOnly" content={['DateCalendar']}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
