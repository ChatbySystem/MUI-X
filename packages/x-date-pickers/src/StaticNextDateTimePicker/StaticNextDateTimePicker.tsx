import * as React from 'react';
import PropTypes from 'prop-types';
import { StaticNextDateTimePickerProps } from './StaticNextDateTimePicker.types';
import { useNextDateTimePickerDefaultizedProps } from '../NextDateTimePicker/shared';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useStaticPicker } from '../internals/hooks/useStaticPicker';
import { CalendarOrClockPickerView } from '../internals/models';
import { renderDateView, renderTimeView } from '../internals/utils/viewRenderers';
import { validateDateTime } from '../internals/hooks/validation/useDateTimeValidation';
import { DateTimePickerTabs } from '../DateTimePicker';

type StaticDateTimePickerComponent = (<TDate>(
  props: StaticNextDateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const VIEW_LOOKUP = {
  day: renderDateView,
  month: renderDateView,
  year: renderDateView,
  hours: renderTimeView,
  minutes: renderTimeView,
  seconds: renderTimeView,
};

const StaticNextDateTimePicker = React.forwardRef(function StaticNextDatePicker<TDate>(
  inProps: StaticNextDateTimePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const defaultizedProps = useNextDateTimePickerDefaultizedProps<
    TDate,
    StaticNextDateTimePickerProps<TDate>
  >(inProps, 'MuiStaticNextDatePicker');

  const displayStaticWrapperAs = defaultizedProps.displayStaticWrapperAs ?? 'mobile';

  // Props with the default values specific to the static variant
  const props = {
    ...defaultizedProps,
    displayStaticWrapperAs,
    showToolbar: defaultizedProps.showToolbar ?? displayStaticWrapperAs === 'mobile',
    components: {
      Tabs: DateTimePickerTabs,
      ...defaultizedProps.components,
    },
  };

  const { renderPicker } = useStaticPicker<TDate, CalendarOrClockPickerView, typeof props>({
    props,
    valueManager: singleItemValueManager,
    viewLookup: VIEW_LOOKUP,
    ref,
    validator: validateDateTime,
  });

  return renderPicker();
}) as StaticDateTimePickerComponent;

StaticNextDateTimePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock: PropTypes.bool,
  autoFocus: PropTypes.bool,
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth: PropTypes.any,
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: PropTypes.oneOf(['desktop', 'mobile']),
  /**
   * Calendar will show more weeks in order to match this value.
   * Put it to 6 for having fix number of week in Gregorian calendars
   * @default undefined
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * Toggles visibility of date time switching tabs
   * @default `false` for mobile, `true` for desktop
   */
  hideTabs: PropTypes.bool,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: PropTypes.object,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: PropTypes.any,
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: PropTypes.any,
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Callback fired when the value is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value changes.
   * @template TValue, TError
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue, TError
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * First view to show.
   */
  openTo: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  readOnly: PropTypes.bool,
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations: PropTypes.bool,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime: PropTypes.func,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * If `true`, the toolbar will be visible.
   * @default `true` for mobile, `false` for desktop
   */
  showToolbar: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.any,
  /**
   * Array of views to show.
   */
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ),
} as any;

export { StaticNextDateTimePicker };
