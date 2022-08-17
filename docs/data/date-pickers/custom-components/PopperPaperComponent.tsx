import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro';
import {
  TextField,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns';
import { RangeShortcut, rangeShortcuts } from './rangeShortcut';

type RangeShortcutType = keyof typeof RangeShortcut;

const RangeShortcutsPanel: React.FC<{
  setValue: React.Dispatch<React.SetStateAction<DateRange<Date>>>;
  children: React.ReactNode;
}> = ({ setValue, children }) => {
  const handleRangeClick = React.useCallback(
    (range: RangeShortcutType) => {
      const today = new Date();
      switch (range) {
        case RangeShortcut.thisWeek:
          setValue([startOfWeek(today), endOfWeek(today)]);
          break;
        case RangeShortcut.lastWeek:
          setValue([
            addWeeks(startOfWeek(today), -1),
            addWeeks(endOfWeek(today), -1),
          ]);
          break;
        case RangeShortcut.last7Days:
          setValue([addWeeks(today, -1), today]);
          break;
        case RangeShortcut.currentMonth:
          setValue([startOfMonth(today), endOfMonth(today)]);
          break;
        case RangeShortcut.nextMonth:
          setValue([
            addMonths(startOfMonth(today), 1),
            addMonths(endOfMonth(today), 1),
          ]);
          break;
        case RangeShortcut.reset:
          setValue([null, null]);
          break;
        default:
          break;
      }
    },
    [setValue],
  );
  return (
    <React.Fragment>
      <Box sx={{ m: 2 }} display="flex" gap={2}>
        <div>
          <Typography variant="overline">Date range shortcuts</Typography>
          <List>
            {rangeShortcuts.map(({ range, label }) => (
              <ListItem key={range} disablePadding>
                <ListItemButton onClick={() => handleRangeClick(range as RangeShortcutType)}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
        <Divider orientation="vertical" />
      </Box>
      {children}
    </React.Fragment>
  );
};

export default function PopperPaperComponent() {
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
  const WrappedPopperPaper = React.useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <RangeShortcutsPanel setValue={setValue}>{children}</RangeShortcutsPanel>
    ),
    [],
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
        components={{
          PopperPaper: WrappedPopperPaper,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'row',
          },
        }}
      />
    </LocalizationProvider>
  );
}
