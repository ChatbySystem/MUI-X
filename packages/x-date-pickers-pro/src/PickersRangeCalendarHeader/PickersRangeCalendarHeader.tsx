import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  PickersArrowSwitcher,
  useLocaleText,
  useNextMonthDisabled,
  usePreviousMonthDisabled,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { PickersRangeCalendarHeaderProps } from './PickersRangeCalendarHeader.types';

type PickersRangeCalendarHeaderComponent = (<TDate extends PickerValidDate>(
  props: PickersRangeCalendarHeaderProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersRangeCalendarHeaderContentSingleCalendar = styled(PickersCalendarHeader, {
  name: 'PickersRangeCalendarHeader',
  slot: 'ContentSingleCalendar',
  overridesResolver: (_, styles) => styles.contentSingleCalendar,
})({}) as typeof PickersCalendarHeader;

const PickersRangeCalendarHeaderContentMultipleCalendars = styled(PickersArrowSwitcher, {
  name: 'PickersRangeCalendarHeader',
  slot: 'ContentMultipleCalendars',
  overridesResolver: (_, styles) => styles.contentMultipleCalendars,
})({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const PickersRangeCalendarHeader = React.forwardRef(function PickersRangeCalendarHeader<
  TDate extends PickerValidDate,
>(inProps: PickersRangeCalendarHeaderProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersRangeCalendarHeader' });
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();

  const { calendars, changeMonth, month, monthIndex, ...other } = props;
  const {
    format,
    slots,
    slotProps,
    currentMonth,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    timezone,
  } = props;

  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, {
    disableFuture,
    maxDate,
    timezone,
  });

  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, {
    disablePast,
    minDate,
    timezone,
  });

  if (calendars === 1) {
    return <PickersRangeCalendarHeaderContentSingleCalendar {...other} ref={ref} />;
  }

  const selectPreviousMonth = () => changeMonth(utils.addMonths(currentMonth, -1));

  const selectNextMonth = () => changeMonth(utils.addMonths(currentMonth, 1));

  return (
    <PickersRangeCalendarHeaderContentMultipleCalendars
      ref={ref}
      onGoToPrevious={selectPreviousMonth}
      onGoToNext={selectNextMonth}
      isPreviousHidden={monthIndex !== 0}
      isPreviousDisabled={isPreviousMonthDisabled}
      previousLabel={localeText.previousMonth}
      isNextHidden={monthIndex !== calendars - 1}
      isNextDisabled={isNextMonthDisabled}
      nextLabel={localeText.nextMonth}
      slots={slots}
      slotProps={slotProps}
    >
      {utils.formatByString(month, format ?? `${utils.formats.month} ${utils.formats.year}`)}
    </PickersRangeCalendarHeaderContentMultipleCalendars>
  );
}) as PickersRangeCalendarHeaderComponent;

PickersRangeCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of calendars rendered.
   */
  calendars: PropTypes.oneOf([1, 2, 3]).isRequired,
  /**
   * Callback to call to change the current month.
   * @param {TDate} newMonth The value to set to "currentMonth".
   */
  changeMonth: PropTypes.func.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  currentMonth: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format: PropTypes.string,
  labelId: PropTypes.string,
  maxDate: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  /**
   * Month used for this header.
   */
  month: PropTypes.object.isRequired,
  /**
   * Index of the month used for this header.
   */
  monthIndex: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  reduceAnimations: PropTypes.bool.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  timezone: PropTypes.string.isRequired,
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;

export { PickersRangeCalendarHeader };
