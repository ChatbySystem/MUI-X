import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const today = dayjs();

const isInCurrentYear = (date: Dayjs) => date.get('year') === dayjs().get('year');

const GridItem = ({
  label,
  children,
  spacing = 1,
}: {
  label: string;
  children: React.ReactNode;
  spacing?: number;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ mb: spacing }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export default function DateValidationShouldDisableYear() {
  const [datePickerValue, setDatePickerValue] = React.useState<Dayjs | null>(today);
  const [dateTimePickerValue, setDateTimePickerValue] = React.useState<Dayjs | null>(
    today,
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <GridItem label="DatePicker">
          <DatePicker
            shouldDisableDate={isInCurrentYear}
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
        <GridItem label="DateTimePicker">
          <DateTimePicker
            shouldDisableDate={isInCurrentYear}
            value={dateTimePickerValue}
            onChange={(newValue) => setDateTimePickerValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </GridItem>
      </Stack>
    </LocalizationProvider>
  );
}
