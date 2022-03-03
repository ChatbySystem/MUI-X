import * as React from 'react';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
} from '@mui/x-date-pickers/CalendarPicker/PickersCalendarHeader';
import {
  useDefaultDates,
  useUtils,
  ExportedDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { DayPicker, PickersCalendarProps } from '@mui/x-date-pickers/CalendarPicker/DayPicker';
import { doNothing } from '../internal/utils/utils';
import { DateRange } from '../internal/models/dateRange';
import { DateRangePickerDay } from '../DateRangePickerDay';
import { ExportedDesktopDateRangeCalendarProps } from './DateRangePickerViewDesktop';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';

export interface ExportedMobileDateRangeCalendarProps<TDate>
  extends Pick<ExportedDesktopDateRangeCalendarProps<TDate>, 'renderDay'> {}

interface DesktopDateRangeCalendarProps<TDate>
  extends ExportedMobileDateRangeCalendarProps<TDate>,
    Omit<PickersCalendarProps<TDate>, 'date' | 'renderDay' | 'onFocusedDayChange'>,
    ExportedDateValidationProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  date: DateRange<TDate>;
  changeMonth: (date: TDate) => void;
}

const onlyDayView = ['day'] as const;

/**
 * @ignore - internal component.
 */
export function DateRangePickerViewMobile<TDate>(props: DesktopDateRangeCalendarProps<TDate>) {
  const {
    changeMonth,
    components,
    componentsProps,
    date,
    leftArrowButtonText,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onChange,
    renderDay = (_, dayProps) => <DateRangePickerDay<TDate> {...dayProps} />,
    rightArrowButtonText,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  return (
    <React.Fragment>
      <PickersCalendarHeader
        components={components}
        componentsProps={componentsProps}
        leftArrowButtonText={leftArrowButtonText}
        maxDate={maxDate}
        minDate={minDate}
        onMonthChange={changeMonth as any}
        openView="day"
        rightArrowButtonText={rightArrowButtonText}
        views={onlyDayView}
        {...other}
      />
      <DayPicker<TDate>
        {...other}
        date={date}
        onChange={onChange}
        onFocusedDayChange={doNothing}
        renderDay={(day, _, DayProps) =>
          renderDay(day, {
            isPreviewing: false,
            isStartOfPreviewing: false,
            isEndOfPreviewing: false,
            isHighlighting: isWithinRange(utils, day, date),
            isStartOfHighlighting: isStartOfRange(utils, day, date),
            isEndOfHighlighting: isEndOfRange(utils, day, date),
            ...DayProps,
          })
        }
      />
    </React.Fragment>
  );
}
