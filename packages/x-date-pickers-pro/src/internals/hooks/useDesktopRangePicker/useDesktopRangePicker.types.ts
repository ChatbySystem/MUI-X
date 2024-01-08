import {
  UsePickerParams,
  BasePickerProps,
  PickersPopperSlots,
  PickersPopperSlotProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { RangeFieldSection, DateRange } from '../../../models';
import { BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlots,
  RangePickerFieldSlotProps,
} from '../useEnrichedRangePickerFieldProps';

export interface UseDesktopRangePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends PickersPopperSlots,
    ExportedPickersLayoutSlots<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlots {}

export interface UseDesktopRangePickerSlotProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends PickersPopperSlotProps,
    ExportedPickersLayoutSlotProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotProps<TDate, TTextFieldVersion> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface DesktopRangeOnlyPickerProps
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerViewsNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends DesktopRangeOnlyPickerProps,
    BasePickerProps<
      DateRange<TDate>,
      TDate,
      TView,
      TError,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopRangePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotProps<TDate, TView, TTextFieldVersion>;
}

export interface DesktopRangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TExternalProps extends UseDesktopRangePickerProps<
    TDate,
    TView,
    TTextFieldVersion,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      RangeFieldSection,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    >,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
}
