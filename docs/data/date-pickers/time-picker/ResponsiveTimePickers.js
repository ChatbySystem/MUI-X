import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';
import { Unstable_DesktopNextTimePicker as DesktopNextTimePicker } from '@mui/x-date-pickers/DesktopNextTimePicker';
import { Unstable_StaticNextTimePicker as StaticNextTimePicker } from '@mui/x-date-pickers/StaticNextTimePicker';

export default function ResponsiveTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        content={[
          'DesktopNextTimePicker',
          'MobileNextTimePicker',
          'NextTimePicker',
          'StaticNextTimePicker',
        ]}
      >
        <DemoItem label="Desktop variant" content={['DesktopNextTimePicker']}>
          <DesktopNextTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant" content={['MobileNextTimePicker']}>
          <MobileNextTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant" content={['NextTimePicker']}>
          <NextTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant" content={['StaticNextTimePicker']}>
          <StaticNextTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
