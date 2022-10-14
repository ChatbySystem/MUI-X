import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { CalendarOrClockPickerView } from '../../models';
import { UseMobilePickerParams } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { useUtils } from '../useUtils';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { BaseFieldProps } from '../../models/fields';
import { PickerViewContainer } from '../../components/PickerViewContainer';
import { PickerViewLayout } from '../../components/PickerViewLayout';

/**
 * Hook managing all the single-date mobile pickers:
 * - MobileDatePicker
 * - MobileDateTimePicker
 * - MobileTimePicker
 */
export const useMobilePicker = <TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
  sectionModeLookup,
}: UseMobilePickerParams<TDate, TView>) => {
  const { components, componentsProps = {}, className, inputFormat, disabled, localeText } = props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    fieldProps: pickerFieldProps,
    layoutProps,
    renderViews,
    actions,
    open,
    isLandscape,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'mobile',
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
    additionalViewProps: {},
  });

  const Field = components.Field;
  const fieldProps: BaseFieldProps<TDate | null, unknown> = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: true,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const componentsPropsForField: BaseFieldProps<TDate, unknown>['componentsProps'] = {
    ...fieldProps.componentsProps,
    input: (ownerState) => {
      const externalInputProps = resolveComponentProps(componentsProps.input, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.input,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        onClick: props.readOnly ? undefined : actions.onOpen,
        onKeyDown: onSpaceOrEnter(actions.onOpen),
        inputProps: {
          'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
          ...inputPropsPassedByField?.inputProps,
          ...externalInputProps?.inputProps,
        },
      };
    },
  };

  const componentsForField: BaseFieldProps<TDate, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
  };

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
          inputRef={handleInputRef}
        />
        <PickersModalDialog
          {...actions}
          open={open}
          components={components}
          componentsProps={componentsProps}
        >
          <PickerViewContainer isLandscape={isLandscape}>
            <PickerViewLayout
              {...layoutProps}
              components={components}
              componentsProps={componentsProps}
            >
              {renderViews()}
            </PickerViewLayout>
          </PickerViewContainer>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
