'use client';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { validateTime } from '../validation';
import { useSplitFieldProps } from '../hooks';
import { useDefaultizedTimeField } from '../internals/hooks/defaultizedFieldProps';
import { PickerValue } from '../internals/models';
import { useGetOpenDialogAriaLabel } from '../internals/hooks/useGetOpenDialogAriaLabel';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  const getOpenDialogAriaLabel = useGetOpenDialogAriaLabel({
    formatKey: 'fullTime',
    translationKey: 'openTimePickerDialogue',
  });

  return useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateTime,
    valueType: 'time',
    getOpenDialogAriaLabel,
  });
};
