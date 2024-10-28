import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import {
  FieldSection,
  PickerValidDate,
  TimeValidationError,
  BuiltInFieldTextFieldProps,
} from '../models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';

export interface UseTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        TimeValidationError
      >,
      'format'
    >,
    TimeValidationProps,
    BaseTimeValidationProps,
    ExportedUseClearableFieldProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export type TimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseTimeFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: TimeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: TimeFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
    };

export type TimeFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  TimeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface TimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    TimeFieldOwnerState<TEnableAccessibleFieldDOMStructure>
  >;
}
