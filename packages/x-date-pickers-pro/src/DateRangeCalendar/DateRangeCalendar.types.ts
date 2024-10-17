import * as React from 'react';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/utils';
import { Theme } from '@mui/material/styles';
import { PickerValidDate, TimezoneProps } from '@mui/x-date-pickers/models';
import {
  PickersCalendarHeader,
  PickersCalendarHeaderSlots,
  PickersCalendarHeaderSlotProps,
} from '@mui/x-date-pickers/PickersCalendarHeader';
import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayCalendarProps,
  DayCalendarSlots,
  DayCalendarSlotProps,
  PickersArrowSwitcherSlots,
  PickersArrowSwitcherSlotProps,
  DayCalendarProps,
  ExportedUseViewsOptions,
} from '@mui/x-date-pickers/internals';
import { DayRangeValidationProps } from '../internals/models/dateRange';
import { DateRange, RangePosition } from '../models';
import { DateRangeCalendarClasses } from './dateRangeCalendarClasses';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';
import { PickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';

export interface DateRangeCalendarSlots
  extends PickersArrowSwitcherSlots,
    Omit<DayCalendarSlots, 'day'>,
    PickersCalendarHeaderSlots {
  /**
   * Custom component for calendar header.
   * Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component.
   * @default PickersCalendarHeader
   */
  calendarHeader?: React.ElementType<PickersRangeCalendarHeaderProps>;
  /**
   * Custom component for day in range pickers.
   * Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component.
   * @default DateRangePickersDay
   */
  day?: React.ElementType<DateRangePickerDayProps>;
}

export interface DateRangeCalendarSlotProps
  extends PickersArrowSwitcherSlotProps,
    Omit<DayCalendarSlotProps, 'day'>,
    PickersCalendarHeaderSlotProps {
  calendarHeader?: SlotComponentProps<typeof PickersCalendarHeader, {}, DateRangeCalendarProps>;
  day?: SlotComponentProps<
    typeof DateRangePickerDay,
    {},
    DayCalendarProps & { day: PickerValidDate; selected: boolean }
  >;
}

export interface ExportedDateRangeCalendarProps
  extends ExportedDayCalendarProps,
    BaseDateValidationProps,
    DayRangeValidationProps,
    TimezoneProps {
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  /**
   * Callback fired on month change.
   * @param {PickerValidDate} month The new month.
   */
  onMonthChange?: (month: PickerValidDate) => void;
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition?: 1 | 2 | 3;
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing?: boolean;
}

export interface DateRangeCalendarProps
  extends ExportedDateRangeCalendarProps,
    UseRangePositionProps,
    ExportedUseViewsOptions<DateRange, 'day'> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: DateRange;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: DateRange;
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */
  referenceDate?: PickerValidDate;
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangeCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateRangeCalendarSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangeCalendarSlotProps;
  /**
   * Range positions available for selection.
   * This list is checked against when checking if a next range position can be selected.
   *
   * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
   * @default ['start', 'end']
   */
  availableRangePositions?: RangePosition[];
}

export interface DateRangeCalendarOwnerState extends DateRangeCalendarProps {
  isDragging: boolean;
}

export type DateRangeCalendarDefaultizedProps = DefaultizedProps<
  DateRangeCalendarProps,
  | 'views'
  | 'openTo'
  | 'reduceAnimations'
  | 'calendars'
  | 'disableDragEditing'
  | 'availableRangePositions'
  | keyof BaseDateValidationProps
>;
