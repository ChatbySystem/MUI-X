import { CalendarPickerProps } from '../CalendarPicker';
import { CalendarPickerSkeletonProps } from '../CalendarPickerSkeleton';
import { ClockPickerProps } from '../ClockPicker';
import { DatePickerProps } from '../DatePicker';
import { DateTimePickerProps } from '../DateTimePicker';
import { DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import { DesktopTimePickerProps } from '../DesktopTimePicker';
import { MobileDatePickerProps } from '../MobileDatePicker';
import { MobileDateTimePickerProps } from '../MobileDateTimePicker';
import { MobileTimePickerProps } from '../MobileTimePicker';
import { MonthPickerProps } from '../MonthPicker';
import { PickersDayProps } from '../PickersDay';
import { StaticDatePickerProps } from '../StaticDatePicker';
import { StaticDateTimePickerProps } from '../StaticDateTimePicker';
import { StaticTimePickerProps } from '../StaticTimePicker';
import { TimePickerProps } from '../TimePicker';
import { YearPickerProps } from '../YearPicker';
import { PickerStaticWrapperProps } from '../internals/components/PickerStaticWrapper';
import { DayPickerProps } from '../internals';
import { PickersCalendarHeaderProps } from '../CalendarPicker/PickersCalendarHeader';
import { PickersFadeTransitionGroupProps } from '../CalendarPicker/PickersFadeTransitionGroup';
import { ClockProps } from '../ClockPicker/Clock';
import { ClockNumberProps } from '../ClockPicker/ClockNumber';
import { ClockPointerProps } from '../ClockPicker/ClockPointer';

export interface PickersComponentsPropsList {
  MuiCalendarPicker: CalendarPickerProps<unknown>;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonProps;
  MuiClock: ClockProps<unknown>;
  MuiClockNumber: ClockNumberProps;
  MuiClockPicker: ClockPickerProps<unknown>;
  MuiClockPointer: ClockPointerProps;
  MuiDatePicker: DatePickerProps<unknown, unknown>;
  MuiDateTimePicker: DateTimePickerProps<unknown, unknown>;
  MuiDayPicker: DayPickerProps<unknown>;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps<unknown, unknown>;
  MuiDesktopTimePicker: DesktopTimePickerProps<unknown, unknown>;
  MuiMobileDatePicker: MobileDatePickerProps<unknown, unknown>;
  MuiMobileDateTimePicker: MobileDateTimePickerProps<unknown, unknown>;
  MuiMobileTimePicker: MobileTimePickerProps<unknown, unknown>;
  MuiMonthPicker: MonthPickerProps<unknown>;
  MuiPickersCalendarHeader: PickersCalendarHeaderProps<unknown>;
  MuiPickersDay: PickersDayProps<unknown>;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupProps;
  MuiStaticDatePicker: StaticDatePickerProps<unknown, unknown>;
  MuiStaticDateTimePicker: StaticDateTimePickerProps<unknown, unknown>;
  MuiStaticTimePicker: StaticTimePickerProps<unknown, unknown>;
  MuiTimePicker: TimePickerProps<unknown, unknown>;
  MuiYearPicker: YearPickerProps<unknown>;
  MuiPickerStaticWrapper: PickerStaticWrapperProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends PickersComponentsPropsList {}
}

// disable automatic export
export {};
