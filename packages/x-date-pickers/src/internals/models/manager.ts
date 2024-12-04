import type { PickerManager } from '../../models';
import { PickerRangeValue } from './value';

export type PickerAnyManager = PickerManager<any, any, any, any, any>;

export type PickerAnyRangeManager = PickerManager<PickerRangeValue, any, any, any, any>;

type PickerManagerProperties<TManager extends PickerAnyManager> =
  TManager extends PickerManager<
    infer TValue,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TFieldInternalProps,
    infer TFieldInternalPropsWithDefaults
  >
    ? {
        value: TValue;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        fieldInternalProps: TFieldInternalProps;
        fieldInternalPropsWithDefaults: TFieldInternalPropsWithDefaults;
      }
    : never;

export type PickerManagerFieldInternalProps<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['fieldInternalProps'];

export type PickerManagerFieldInternalPropsWithDefaults<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['fieldInternalPropsWithDefaults'];

export type PickerManagerEnableAccessibleFieldDOMStructure<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'];

export type PickerManagerError<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['error'];