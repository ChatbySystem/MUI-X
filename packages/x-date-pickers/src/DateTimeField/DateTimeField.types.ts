import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import {
  DateTimeValidationError,
  FieldSection,
  PickerValidDate,
  BuiltInFieldTextFieldProps,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DayValidationProps,
  MonthValidationProps,
  TimeValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';

export interface UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    DayValidationProps,
    MonthValidationProps,
    YearValidationProps,
    BaseDateValidationProps,
    TimeValidationProps,
    BaseTimeValidationProps,
    DateTimeValidationProps,
    ExportedUseClearableFieldProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export type UseDateTimeFieldComponentProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>> &
  UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>;

export type DateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  UseDateTimeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure,
    BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>
  > & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: DateTimeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: DateTimeFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
  };

export type DateTimeFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  DateTimeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TEnableAccessibleFieldDOMStructure>
  >;
}
