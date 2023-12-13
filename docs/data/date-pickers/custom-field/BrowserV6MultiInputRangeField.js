import * as React from 'react';

import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers-pro';

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    width: '20ch',
  },
);

const BrowserField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    inputRef,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
    error,
    focused,
    ownerState,
    sx,
    textField,
    elements,
    onClick,
    onInput,
    sectionListRef,
    contentEditable,
    onFocus,
    onBlur,
    tabIndex,
    ...other
  } = props;

  const handleRef = useForkRef(containerRef, ref);

  return (
    <Box
      sx={{ ...(sx || {}), display: 'flex', alignItems: 'center' }}
      id={id}
      ref={handleRef}
      {...other}
    >
      {startAdornment}
      <BrowserFieldContent>
        <PickersSectionList
          elements={elements}
          sectionListRef={sectionListRef}
          contentEditable={contentEditable}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
        />
      </BrowserFieldContent>
      {endAdornment}
    </Box>
  );
});

const BrowserMultiInputDateRangeField = React.forwardRef((props, ref) => {
  const {
    slotProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    disabled,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    selectedSections,
    onSelectedSectionsChange,
    className,
    unstableStartFieldRef,
    unstableEndFieldRef,
  } = props;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'start' },
  });

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'end' },
  });

  const fieldResponse = useMultiInputDateRangeField({
    sharedProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
      shouldUseV6TextField: false,
    },
    startTextFieldProps,
    endTextFieldProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  return (
    <Stack
      ref={ref}
      spacing={2}
      direction="row"
      overflow="auto"
      className={className}
    >
      <BrowserField {...fieldResponse.startDate} />
      <span> — </span>
      <BrowserField {...fieldResponse.endDate} />
    </Stack>
  );
});

const BrowserDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      {...props}
      slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
    />
  );
});

export default function BrowserV6MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}
