import * as React from 'react';
import { PickerOwnerState } from '../../../models';
import type { UsePickerProps } from './usePicker.types';
import { PickerValueManager, UsePickerValueResponse } from './usePickerValue.types';
import { useUtils } from '../useUtils';
import { PickerValidValue } from '../../models';

interface UsePickerOwnerStateParameters<TValue extends PickerValidValue> {
  props: UsePickerProps<TValue, any, any, any, any>;
  pickerValueResponse: UsePickerValueResponse<TValue, any>;
  valueManager: PickerValueManager<TValue, any>;
}

export function usePickerOwnerState<TValue extends PickerValidValue>(
  parameters: UsePickerOwnerStateParameters<TValue>,
): PickerOwnerState {
  const { props, pickerValueResponse, valueManager } = parameters;

  const utils = useUtils();

  return React.useMemo(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(
        utils,
        pickerValueResponse.viewProps.value,
        valueManager.emptyValue,
      ),
      isPickerOpen: pickerValueResponse.open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
    }),
    [
      utils,
      valueManager,
      pickerValueResponse.viewProps.value,
      pickerValueResponse.open,
      props.disabled,
      props.readOnly,
    ],
  );
}
