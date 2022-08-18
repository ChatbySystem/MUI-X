import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRange, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import { Box, Typography, Divider, Button } from '@mui/material';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns';

const RangeShortcut = {
  thisWeek: 'THIS_WEEK',
  lastWeek: 'LAST_WEEK',
  last7Days: 'LAST_7_DAYS',
  currentMonth: 'CURRENT_MONTH',
  nextMonth: 'NEXT_MONTH',
  reset: 'RESET',
};

type RangeShortcutType = keyof typeof RangeShortcut;

const rangeShortcuts = [
  {
    range: RangeShortcut.thisWeek,
    label: 'This week',
  },
  {
    range: RangeShortcut.lastWeek,
    label: 'Last week',
  },
  {
    range: RangeShortcut.last7Days,
    label: 'Last 7 days',
  },
  {
    range: RangeShortcut.currentMonth,
    label: 'Current month',
  },
  {
    range: RangeShortcut.nextMonth,
    label: 'Next month',
  },
  {
    range: RangeShortcut.reset,
    label: 'Reset',
  },
];

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
      <Box sx={{ m: 2 }}>
        <Typography variant="overline">Date range shortcuts</Typography>
        <Box display="flex" gap={2} my={2}>
          {rangeShortcuts.map(({ range, label }) => (
            <Button
              key={range}
              onClick={() => handleRangeClick(range as RangeShortcutType)}
              variant="text"
              color="inherit"
              size="small"
            >
              {label}
            </Button>
          ))}
        </Box>
        <Divider />
      </Box>
      {children}
    </React.Fragment>
  );
};

export default function StaticPaperContentComponent() {
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
  const WrappedPaperContent = React.useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <RangeShortcutsPanel setValue={setValue}>{children}</RangeShortcutsPanel>
    ),
    [],
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateRangePicker
        displayStaticWrapperAs="desktop"
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={() => <div />}
        components={{ PaperContent: WrappedPaperContent }}
      />
    </LocalizationProvider>
  );
}
