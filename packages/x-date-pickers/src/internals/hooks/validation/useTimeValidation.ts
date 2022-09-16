import { createIsAfterIgnoreDatePart } from '../../utils/time-utils';
import { useValidation, ValidationProps, Validator } from './useValidation';
import { ClockPickerView } from '../../models';

export interface ExportedTimeValidationProps<TDate> {
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime?: TDate;
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime?: TDate;
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep?: number;
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} clockType The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime?: (timeValue: number, clockType: ClockPickerView) => boolean;
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation?: boolean;
}

export interface TimeValidationProps<TDate>
  extends ExportedTimeValidationProps<TDate>,
    ValidationProps<TimeValidationError, TDate | null> {}

export type TimeValidationError =
  | 'invalidDate'
  | 'minutesStep'
  | 'minTime'
  | 'maxTime'
  | 'shouldDisableTime-hours'
  | 'shouldDisableTime-minutes'
  | 'shouldDisableTime-seconds'
  | null;

export const validateTime: Validator<any, TimeValidationProps<any>> = ({
  adapter,
  value,
  props,
}): TimeValidationError => {
  const {
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation,
  } = props;

  const isAfter = createIsAfterIgnoreDatePart(
    disableIgnoringDatePartForTimeValidation,
    adapter.utils,
  );

  if (value === null) {
    return null;
  }

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(minTime && isAfter(minTime, value)):
      return 'minTime';

    case Boolean(maxTime && isAfter(value, maxTime)):
      return 'maxTime';

    case Boolean(shouldDisableTime && shouldDisableTime(adapter.utils.getHours(value), 'hours')):
      return 'shouldDisableTime-hours';

    case Boolean(
      shouldDisableTime && shouldDisableTime(adapter.utils.getMinutes(value), 'minutes'),
    ):
      return 'shouldDisableTime-minutes';

    case Boolean(
      shouldDisableTime && shouldDisableTime(adapter.utils.getSeconds(value), 'seconds'),
    ):
      return 'shouldDisableTime-seconds';

    case Boolean(minutesStep && adapter.utils.getMinutes(value) % minutesStep !== 0):
      return 'minutesStep';

    default:
      return null;
  }
};

const isSameTimeError = (a: unknown, b: unknown) => a === b;

export const useTimeValidation = <TDate>(props: TimeValidationProps<TDate>): TimeValidationError =>
  useValidation(props, validateTime, isSameTimeError);
