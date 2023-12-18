import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { BaseFieldProps, UseFieldResponse } from '@mui/x-date-pickers/internals';
import {
  BaseSingleInputPickersTextFieldProps,
  FieldRef,
  FieldSection,
} from '@mui/x-date-pickers/models';
import { UseClearableFieldResponse } from '@mui/x-date-pickers';

export interface RangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}

/**
 * Props the `textField` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotTextFieldProps {
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  focused?: boolean;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

/**
 * Props the `root` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotRootProps {
  onBlur?: React.FocusEventHandler;
}

/**
 * Props the multi input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field,
 * not what users can pass using the `props.slotProps.field`.
 */
export interface BaseMultiInputFieldProps<
  TValue,
  TDate,
  TSection extends FieldSection,
  TUseV6TextField extends boolean,
  TError,
> extends Omit<
    BaseFieldProps<TValue, TDate, TSection, TUseV6TextField, TError>,
    'unstableFieldRef'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  slots?: {
    root?: React.ElementType;
    separator?: React.ElementType;
    textField?: React.ElementType;
  };
  slotProps?: {
    root?: SlotComponentProps<
      React.ElementType<MultiInputFieldSlotRootProps>,
      {},
      Record<string, any>
    >;
    textField?: SlotComponentProps<
      React.ElementType<MultiInputFieldSlotTextFieldProps>,
      {},
      { position?: 'start' | 'end' } & Record<string, any>
    >;
  };
}

/**
 * Props the text field receives when used with a multi input picker.
 * Only contains what the MUI components are passing to the text field, not what users can pass using the `props.slotProps.textField`.
 */
export type BaseMultiInputPickersTextFieldProps<TUseV6TextField extends boolean> =
  UseClearableFieldResponse<UseFieldResponse<TUseV6TextField, MultiInputFieldSlotTextFieldProps>>;

/**
 * Props the text field receives when used with a single or multi input picker.
 * Only contains what the MUI components are passing to the text field, not what users can pass using the `props.slotProps.field` or `props.slotProps.textField`.
 */
export type BasePickersTextFieldProps<TUseV6TextField extends boolean> =
  BaseSingleInputPickersTextFieldProps<TUseV6TextField> &
    BaseMultiInputPickersTextFieldProps<TUseV6TextField>;
