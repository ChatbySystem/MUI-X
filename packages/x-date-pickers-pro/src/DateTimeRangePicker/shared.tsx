import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
} from '@mui/x-date-pickers/internals';
import {
  BaseClockProps,
  DesktopOnlyTimePickerProps,
} from '@mui/x-date-pickers/internals/models/props/clock';
import { applyDefaultViewProps } from '@mui/x-date-pickers/internals/utils/views';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import { TimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import {
  DigitalClockSlotsComponent,
  DigitalClockSlotsComponentsProps,
} from '@mui/x-date-pickers/DigitalClock/DigitalClock.types';
import {
  MultiSectionDigitalClockSlotsComponent,
  MultiSectionDigitalClockSlotsComponentsProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock/MultiSectionDigitalClock.types';
import { DateTimeRangeValidationError } from '../models';
import { DateRange, DateTimeRangePickerView } from '../internals/models';
import {
  DateRangeCalendarSlotsComponent,
  DateRangeCalendarSlotsComponentsProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateTimeRangePickerToolbar,
  DateTimeRangePickerToolbarProps,
  ExportedDateTimeRangePickerToolbarProps,
} from './DateTimeRangePickerToolbar';
import { DateRangeViewRendererProps } from '../dateRangeViewRenderers';
import {
  DateTimeRangePickerTabs,
  DateTimeRangePickerTabsProps,
  ExportedDateTimeRangePickerTabsProps,
} from './DateTimeRangePickerTabs';

export interface BaseDateTimeRangePickerSlotsComponent<TDate>
  extends DateRangeCalendarSlotsComponent<TDate>,
    DigitalClockSlotsComponent,
    MultiSectionDigitalClockSlotsComponent {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimeRangePickerTabs
   */
  tabs?: React.ElementType<DateTimeRangePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimeRangePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateTimeRangePickerToolbarProps<TDate>>;
}

export interface BaseDateTimeRangePickerSlotsComponentsProps<TDate>
  extends DateRangeCalendarSlotsComponentsProps<TDate>,
    DigitalClockSlotsComponentsProps,
    MultiSectionDigitalClockSlotsComponentsProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedDateTimeRangePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedDateTimeRangePickerToolbarProps;
}

export interface BaseDateTimeRangePickerProps<TDate>
  extends Omit<
      BasePickerInputProps<
        DateRange<TDate>,
        TDate,
        DateTimeRangePickerView,
        DateTimeRangeValidationError
      >,
      'orientation'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<
      DateRange<TDate>,
      DateTimeRangePickerView,
      Omit<DateRangeViewRendererProps<TDate, 'day'>, 'view' | 'slots' | 'slotProps'> &
        Omit<
          TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TDate, TimeViewWithMeridiem>>,
          'view' | 'slots' | 'slotProps'
        > & { view: DateTimeRangePickerView },
      {}
    >
  >;
}

type UseDateTimeRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseDateValidationProps<TDate>>
>;

export function useDateTimeRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateTimeRangePickerProps<TDate>,
>(props: Props, name: string): UseDateTimeRangePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ...themeProps,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ampm ? ['day', 'hours', 'minutes', 'meridiem'] : ['day', 'hours', 'minutes'],
      defaultOpenTo: 'day',
    }),
    timeSteps: { hours: 1, minutes: 5, seconds: 5, ...themeProps.timeSteps },
    localeText,
    ampm,
    calendars: themeProps.calendars ?? 1,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    slots: {
      tabs: DateTimeRangePickerTabs,
      toolbar: DateTimeRangePickerToolbar,
      ...themeProps.slots,
    },
    slotProps: {
      ...themeProps.slotProps,
      toolbar: {
        ...themeProps.slotProps?.toolbar,
        ampm,
      },
    },
  };
}
