import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { SimpleValue } from '@mui/x-date-pickers/models';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary.light,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.light,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.primary.dark,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  }),
  ...((day as Dayjs).day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...((day as Dayjs).day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, 'week');
};

function Day(
  props: PickersDayProps & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  },
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day as Dayjs, selectedDay)}
      isHovered={isInSameWeek(day as Dayjs, hoveredDay)}
    />
  );
}

export default function WeekPicker() {
  const [hoveredDay, setHoveredDay] = React.useState<SimpleValue>(null);
  const [value, setValue] = React.useState<SimpleValue>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => setValue(newValue)}
        showDaysOutsideCurrentMonth
        displayWeekNumber
        slots={{ day: Day }}
        slotProps={{
          day: (ownerState) =>
            ({
              selectedDay: value,
              hoveredDay,
              onPointerEnter: () => setHoveredDay(ownerState.day),
              onPointerLeave: () => setHoveredDay(null),
            }) as any,
        }}
      />
    </LocalizationProvider>
  );
}
