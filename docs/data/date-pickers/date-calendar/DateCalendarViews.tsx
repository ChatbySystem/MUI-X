import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DateCalendarViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer content={["DateCalendar"]}>
        <DemoItem label={'"year", "month" and "day"'} content={["DateCalendar"]}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label={'"day"'} content={["DateCalendar"]}>
          <DateCalendar views={['day']} />
        </DemoItem>
        <DemoItem label={'"month" and "year"'} content={["DateCalendar"]}>
          <DateCalendar defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
