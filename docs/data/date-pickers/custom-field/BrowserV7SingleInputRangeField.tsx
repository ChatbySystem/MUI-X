import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import { FieldType } from '@mui/x-date-pickers-pro/models';
import { BaseSingleInputPickersTextFieldProps } from '@mui/x-date-pickers/models';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
  '& .MuiInputAdornment-root': {
    height: 'auto',
  },
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

interface BrowserTextFieldProps
  extends BaseSingleInputPickersTextFieldProps<true>,
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof BaseSingleInputPickersTextFieldProps<true>
    > {}

const BrowserTextField = React.forwardRef(
  (props: BrowserTextFieldProps, ref: React.Ref<unknown>) => {
    const {
      // Should be ignored
      enableAccessibleFieldDOMStructure,

      // Should be passed to the PickersSectionList component
      elements,
      sectionListRef,
      contentEditable,
      onFocus,
      onBlur,
      tabIndex,
      onInput,
      onPaste,
      onKeyDown,

      // Should be passed to the button that opens the picker
      openPickerAriaLabel,

      // Can be passed to a hidden <input /> element
      onChange,
      value,

      // Can be passed to an icon to clear the value
      clearable,
      onClear,

      // Can be used to render a custom label
      label,

      // Can be used to style the component
      areAllSectionsEmpty,
      disabled,
      readOnly,
      focused,
      error,

      // The rest can be passed to the root element
      ...other
    } = props;

    const pickerContext = usePickerContext();
    const handleTogglePicker = (event: React.UIEvent) => {
      if (pickerContext.open) {
        pickerContext.onClose(event);
      } else {
        pickerContext.onOpen(event);
      }
    };

    const handleRef = useForkRef(pickerContext.triggerRef, ref);

    return (
      <BrowserFieldRoot ref={handleRef} {...other}>
        <BrowserFieldContent>
          <PickersSectionList
            elements={elements}
            sectionListRef={sectionListRef}
            contentEditable={contentEditable}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={tabIndex}
            onInput={onInput}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
          />
        </BrowserFieldContent>
        <IconButton
          onClick={handleTogglePicker}
          sx={{ marginLeft: 1.5 }}
          aria-label={openPickerAriaLabel}
        >
          <CalendarIcon />
        </IconButton>
      </BrowserFieldRoot>
    );
  },
);

interface BrowserSingleInputDateRangeFieldProps extends DateRangePickerFieldProps {}

type BrowserSingleInputDateRangeFieldComponent = ((
  props: BrowserSingleInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: FieldType };

const BrowserSingleInputDateRangeField = React.forwardRef(
  (props: BrowserSingleInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...other } = props;

    const textFieldProps: typeof props = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      externalForwardedProps: other,
      ownerState: props as any,
    });

    const fieldResponse = useSingleInputDateRangeField<true, typeof textFieldProps>(
      textFieldProps,
    );

    return (
      <BrowserTextField
        {...fieldResponse}
        ref={ref}
        style={{
          minWidth: 300,
        }}
      />
    );
  },
) as BrowserSingleInputDateRangeFieldComponent;

BrowserSingleInputDateRangeField.fieldType = 'single-input';

const BrowserSingleInputDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DateRangePicker
        ref={ref}
        {...props}
        slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
      />
    );
  },
);

export default function BrowserV7SingleInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserSingleInputDateRangePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}
