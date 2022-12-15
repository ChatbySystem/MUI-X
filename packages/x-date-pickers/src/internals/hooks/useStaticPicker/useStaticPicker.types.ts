import * as React from 'react';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '../../../PickersLayout';
import { DateOrTimeView } from '../../models';
import { BaseNextPickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';

export interface UseStaticPickerSlotsComponent<TValue, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponent<TValue, TView> {}

export interface UseStaticPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<TDate | null, TView> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
}

export interface UseStaticPickerProps<TDate, TView extends DateOrTimeView, TError, TValue>
  extends BaseNextPickerProps<TDate | null, TDate, TView, TError>,
    StaticOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: UseStaticPickerSlotsComponent<TValue, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseStaticPickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticPickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any, any>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
