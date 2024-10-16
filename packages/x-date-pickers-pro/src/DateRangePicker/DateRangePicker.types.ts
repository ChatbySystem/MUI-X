import {
  DesktopDateRangePickerProps,
  DesktopDateRangePickerSlots,
  DesktopDateRangePickerSlotProps,
} from '../DesktopDateRangePicker';
import {
  MobileDateRangePickerProps,
  MobileDateRangePickerSlots,
  MobileDateRangePickerSlotProps,
} from '../MobileDateRangePicker';

export interface DateRangePickerSlots
  extends DesktopDateRangePickerSlots,
    MobileDateRangePickerSlots {}

export interface DateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface DateRangePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDateRangePickerProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerProps<TEnableAccessibleFieldDOMStructure> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}
