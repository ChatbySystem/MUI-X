import type { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import type {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { PickerValueManagerV8, PickerValidDate, DateValidationError } from '../models';
import { validateDate } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedUseClearableFieldProps } from '../hooks/useClearableField';

export type DateValueManager<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = PickerValueManagerV8<
  TDate,
  false,
  TEnableAccessibleFieldDOMStructure,
  DateValidationError,
  DateFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
  DateFieldInternalPropsWithDefaults<TDate, TEnableAccessibleFieldDOMStructure>
>;

export interface DateFieldInternalProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<TDate, false, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    ExportedUseClearableFieldProps {}

export interface DateFieldInternalPropsWithDefaults<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DefaultizedProps<
    DateFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    keyof BaseDateValidationProps<TDate> | 'format'
  > {}

export const getDateValueManager = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure = false as TEnableAccessibleFieldDOMStructure,
): DateValueManager<TDate, TEnableAccessibleFieldDOMStructure> => ({
  legacyValueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
  applyDefaultsToFieldInternalProps: ({ internalProps, utils, defaultDates }) => ({
    ...internalProps,
    disablePast: internalProps.disablePast ?? false,
    disableFuture: internalProps.disableFuture ?? false,
    format: internalProps.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, internalProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, internalProps.maxDate, defaultDates.maxDate),
  }),
  enableAccessibleFieldDOMStructure,
});
