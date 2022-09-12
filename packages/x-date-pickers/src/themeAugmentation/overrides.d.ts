import {
  CalendarPickerClassKey,
  DayPickerClassKey,
  PickersCalendarHeaderClassKey,
  PickersFadeTransitionGroupClassKey,
} from '../CalendarPicker';
import { CalendarPickerSkeletonClassKey } from '../CalendarPickerSkeleton';
import {
  ClockClassKey,
  ClockNumberClassKey,
  ClockPickerClassKey,
  ClockPointerClassKey,
} from '../ClockPicker';
import { MonthPickerClassKey } from '../MonthPicker';
import { PickersDayClassKey } from '../PickersDay';
import { YearPickerClassKey } from '../YearPicker';
import { PickerStaticWrapperClassKey } from '../internals/components/PickerStaticWrapper';
import { DatePickerToolbarClassKey } from '../DatePicker';
import { DateTimePickerTabsClassKey, DateTimePickerToolbarClassKey } from '../DateTimePicker';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiCalendarPicker: CalendarPickerClassKey;
  MuiCalendarPickerSkeleton: CalendarPickerSkeletonClassKey;
  MuiClock: ClockClassKey;
  MuiClockNumber: ClockNumberClassKey;
  MuiClockPicker: ClockPickerClassKey;
  MuiClockPointer: ClockPointerClassKey;
  MuiDatePicker: never;
  MuiDatePickerToolbar: DatePickerToolbarClassKey;
  MuiDateTimePicker: never;
  MuiDateTimePickerTabs: DateTimePickerTabsClassKey;
  MuiDateTimePickerToolbar: DateTimePickerToolbarClassKey;
  MuiDayPicker: DayPickerClassKey;
  MuiMonthPicker: MonthPickerClassKey;
  MuiPickersCalendarHeader: PickersCalendarHeaderClassKey;
  MuiPickersDay: PickersDayClassKey;
  MuiPickersFadeTransitionGroup: PickersFadeTransitionGroupClassKey;
  MuiYearPicker: YearPickerClassKey;
  MuiPickerStaticWrapper: PickerStaticWrapperClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
