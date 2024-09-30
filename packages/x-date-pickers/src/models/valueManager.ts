import type { FieldValueManager, UseFieldInternalProps } from '../internals/hooks/useField';
import type { PickerValueManager } from '../internals/hooks/usePicker';
import type { MuiPickersAdapterContextValue } from '../LocalizationProvider/LocalizationProvider';
import type { Validator } from '../validation';
import type { InferValueFromDate, InferFieldSection, FieldValueType } from './fields';
import { PickerValidDate } from './pickers';

/**
 * Object that contains all the necessary methods and properties to control the value of a picker.
 * You should never create your own value manager.
 * Instead, use the ones provided exported from '@mui/x-date-pickers/valueManagers' and '@mui/x-date-pickers-pro/valueManagers'.
 */
export interface PickerValueManagerV8<
  TDate extends PickerValidDate,
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TInternalProps extends Partial<
    UseFieldInternalProps<any, any, any, TEnableAccessibleFieldDOMStructure, any>
  >,
  TInternalPropsWithDefaults extends UseFieldInternalProps<
    any,
    any,
    any,
    TEnableAccessibleFieldDOMStructure,
    any
  >,
> {
  // The v7 value manager object.
  // This will be inlined inside the main `PickerValueManagerV8` object once every object using it is compatible with the new API.
  legacyValueManager: PickerValueManager<InferValueFromDate<TDate, TIsRange>, TDate, TError>;
  fieldValueManager: FieldValueManager<
    InferValueFromDate<TDate, TIsRange>,
    TDate,
    InferFieldSection<TIsRange>
  >;
  validator: Validator<
    InferValueFromDate<TDate, TIsRange>,
    TDate,
    TError,
    TInternalPropsWithDefaults
  >;
  applyDefaultsToFieldInternalProps: (params: {
    adapter: MuiPickersAdapterContextValue<TDate>;
    internalProps: TInternalProps;
  }) => TInternalPropsWithDefaults;
  valueType: FieldValueType;
}

export type PickerAnyValueManagerV8 = PickerValueManagerV8<any, any, any, any, any, any>;

export type PickerAnyAccessibleValueManagerV8 = PickerValueManagerV8<any, any, true, any, any, any>;

/**
 * Infer all the usual generic in the picker packages from a `PickerConroller` interface.
 */
export type PickerValueManagerProperties<TValueManager extends PickerAnyValueManagerV8> =
  TValueManager extends PickerValueManagerV8<
    infer TDate,
    infer TIsRange,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TInternalProps,
    infer TInternalPropsWithDefaults
  >
    ? {
        // Generics
        date: TDate;
        isRange: TIsRange;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        internalProps: TInternalProps;
        internalPropsWithDefaults: TInternalPropsWithDefaults;

        // Derived properties
        value: InferValueFromDate<TDate, TIsRange>;
        section: InferFieldSection<TIsRange>;
      }
    : never;
