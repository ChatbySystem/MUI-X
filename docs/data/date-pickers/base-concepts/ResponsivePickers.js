import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function ResponsivePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker', 'DesktopDatePicker', 'MobileDatePicker']}
      >
        <DemoItem label="Responsive variant" components={['DatePicker']}>
          <DatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Desktop variant" components={['DesktopDatePicker']}>
          <DesktopDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Mobile variant" components={['MobileDatePicker']}>
          <MobileDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
