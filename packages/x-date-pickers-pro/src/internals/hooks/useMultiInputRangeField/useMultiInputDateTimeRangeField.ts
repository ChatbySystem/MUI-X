import useEventCallback from '@mui/utils/useEventCallback';
import { unstable_useDateTimeField as useDateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerRangeValue,
  PickerValue,
  UseFieldResponse,
  useControlledValueWithTimezone,
  useFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { useValidation } from '@mui/x-date-pickers/validation';
import { DateTimeValidationError } from '@mui/x-date-pickers/models';
import { UseMultiInputDateTimeRangeFieldParams } from '../../../MultiInputDateTimeRangeField/MultiInputDateTimeRangeField.types';
import { validateDateTimeRange } from '../../../validation';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { DateTimeRangeValidationError } from '../../../models';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';
import { useDateTimeRangeValueManager } from '../../../valueManagers';

export const useMultiInputDateTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
>({
  sharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputDateTimeRangeFieldParams<
  TEnableAccessibleFieldDOMStructure,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps> => {
  const valueManager = useDateTimeRangeValueManager(sharedProps);
  const sharedPropsWithDefaults = useFieldInternalPropsWithDefaults({
    valueManager,
    internalProps: sharedProps,
  });

  const {
    value: valueProp,
    defaultValue,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
    timezone: timezoneProp,
    enableAccessibleFieldDOMStructure,
    autoFocus,
  } = sharedPropsWithDefaults;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'useMultiInputDateTimeRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: rangeValueManager,
  });

  const { validationError, getValidationErrorForNewValue } = useValidation({
    props: sharedPropsWithDefaults,
    value,
    timezone,
    validator: validateDateTimeRange,
    onError: sharedPropsWithDefaults.onError,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<PickerValue, DateTimeValidationError> => {
    return (newDateTime, rawContext) => {
      const newDateTimeRange: PickerRangeValue =
        index === 0 ? [newDateTime, value[1]] : [value[0], newDateTime];

      const context: FieldChangeHandlerContext<DateTimeRangeValidationError> = {
        ...rawContext,
        validationError: getValidationErrorForNewValue(newDateTimeRange),
      };

      handleValueChange(newDateTimeRange, context);
    };
  };

  const handleStartDateTimeChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateTimeChange = useEventCallback(buildChangeHandler(1));

  const selectedSectionsResponse = useMultiInputFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startFieldProps = {
    error: !!validationError[0],
    ...startTextFieldProps,
    ...selectedSectionsResponse.start,
    disabled,
    readOnly,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateTimeChange,
    enableAccessibleFieldDOMStructure,
    autoFocus, // Do not add on end field.
  };

  const endFieldProps = {
    error: !!validationError[1],
    ...endTextFieldProps,
    ...selectedSectionsResponse.end,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateTimeChange,
    enableAccessibleFieldDOMStructure,
  };

  const startDateTimeResponse = useDateTimeField<
    TEnableAccessibleFieldDOMStructure,
    typeof startFieldProps
  >(startFieldProps) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  const endDateTimeResponse = useDateTimeField<
    TEnableAccessibleFieldDOMStructure,
    typeof endFieldProps
  >(endFieldProps) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateTimeResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateTimeResponse, ['clearable', 'onClear']),
  };
};
