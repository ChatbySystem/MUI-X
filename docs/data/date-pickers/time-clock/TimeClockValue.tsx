import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function TimeClockValue() {
  const [value, setValue] = React.useState<SimpleValue>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock']}>
        <DemoItem label="Uncontrolled clock">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Controlled clock">
          <TimeClock value={value} onChange={setValue} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
