import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { Clock } from '../icons';
import { ParseableDate } from '../../models/parseableDate';
import { ExportedClockPickerProps } from '../ClockPicker/ClockPickerInternal';
import { pick12hOr24hFormat } from '../../internal/pickers/text-field-helper';
import { useUtils } from '../../hooks/useUtils';
import { ValidationProps } from '../../hooks/validation/useValidation';
import { TimeValidationError } from '../../hooks/validation/useTimeValidation';
import { BasePickerProps, BaseToolbarProps } from '../../internal/pickers/typings/BasePicker';
import { ExportedDateInputProps } from '../../internal/pickers/PureDateInput';
import { ClockPickerView, MuiPickersAdapter } from '../../models';

export interface BaseTimePickerProps<TDate>
  extends ExportedClockPickerProps<TDate>,
    BasePickerProps<ParseableDate<TDate>, TDate | null>,
    ValidationProps<TimeValidationError, ParseableDate<TDate>>,
    ExportedDateInputProps<ParseableDate<TDate>, TDate | null> {
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange?: (view: ClockPickerView) => void;
  /**
   * First view to show.
   */
  openTo?: ClockPickerView;
  /**
   * Component that will replace default toolbar renderer.
   * @default TimePickerToolbar
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate | null>>;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select time'
   */
  toolbarTitle?: React.ReactNode;
  /**
   * Array of views to show.
   */
  views?: readonly ClockPickerView[];
}

function getTextFieldAriaText<TDate>(value: ParseableDate<TDate>, utils: MuiPickersAdapter<TDate>) {
  return value && utils.isValid(utils.date(value))
    ? `Choose time, selected time is ${utils.format(utils.date(value) as TDate, 'fullTime')}`
    : 'Choose time';
}

type DefaultizedProps<Props> = Props & { inputFormat: string };
export function useTimePickerDefaultizedProps<TDate, Props extends BaseTimePickerProps<TDate>>(
  {
    ampm,
    components,
    inputFormat,
    openTo = 'hours',
    views = ['hours', 'minutes'],
    ...other
  }: Props,
  name: string,
): DefaultizedProps<Props> & Required<Pick<BaseTimePickerProps<TDate>, 'openTo' | 'views'>> {
  const utils = useUtils<TDate>();
  const willUseAmPm = ampm ?? utils.is12HourCycleInCurrentLocale();

  return useThemeProps({
    props: {
      views,
      openTo,
      ampm: willUseAmPm,
      acceptRegex: willUseAmPm ? /[\dapAP]/gi : /\d/gi,
      mask: '__:__',
      disableMaskedInput: willUseAmPm,
      getOpenDialogAriaText: getTextFieldAriaText,
      components: {
        OpenPickerIcon: Clock,
        ...components,
      },
      inputFormat: pick12hOr24hFormat(inputFormat, willUseAmPm, {
        localized: utils.formats.fullTime,
        '12h': utils.formats.fullTime12h,
        '24h': utils.formats.fullTime24h,
      }),
      ...(other as Props),
    },
    name,
  });
}
