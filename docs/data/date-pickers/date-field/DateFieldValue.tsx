import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function DateFieldValue() {
  const [value, setValue] = React.useState<SimpleValue>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField']}>
        <DateField label="Uncontrolled field" defaultValue={dayjs('2022-04-17')} />
        <DateField label="Controlled field" value={value} onChange={setValue} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
