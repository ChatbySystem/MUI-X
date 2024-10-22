import * as React from 'react';
import { FieldSection, PickerOwnerState, PickerValidDate } from '../../../models';
import { UsePickerValueResponse } from './usePickerValue.types';
import {
  PickersProviderProps,
  PickersContextValue,
  PickersPrivateContextValue,
} from '../../components/PickersProvider';

export interface UsePickerProviderParameters<TValue, TDate extends PickerValidDate>
  extends Pick<PickersProviderProps<TValue, TDate>, 'localeText'> {
  pickerValueResponse: UsePickerValueResponse<TValue, FieldSection, any>;
  ownerState: PickerOwnerState<TValue>;
}

export interface UsePickerProviderReturnValue<TValue, TDate extends PickerValidDate>
  extends Omit<PickersProviderProps<TValue, TDate>, 'children'> {}

export function usePickerProvider<TValue, TDate extends PickerValidDate>(
  parameters: UsePickerProviderParameters<TValue, TDate>,
): UsePickerProviderReturnValue<TValue, TDate> {
  const { pickerValueResponse, ownerState, localeText } = parameters;

  const contextValue = React.useMemo<PickersContextValue>(
    () => ({
      onOpen: pickerValueResponse.actions.onOpen,
      onClose: pickerValueResponse.actions.onClose,
      open: pickerValueResponse.open,
    }),
    [
      pickerValueResponse.actions.onOpen,
      pickerValueResponse.actions.onClose,
      pickerValueResponse.open,
    ],
  );

  const privateContextValue = React.useMemo<PickersPrivateContextValue<TValue>>(
    () => ({ ownerState }),
    [ownerState],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}
