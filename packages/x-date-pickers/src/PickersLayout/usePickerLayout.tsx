import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickersLayoutProps, SubComponents } from './PickersLayout.types';
import { getPickersLayoutUtilityClass } from './pickersLayoutClasses';
import { DateOrTimeView } from '../internals';
import { PickersShortcuts } from '../PickersShortcuts';

const useUtilityClasses = (ownerState: PickersLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
    shortcuts: ['shortcuts'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

export interface UsePickerLayoutResponse extends SubComponents {}

const usePickerLayout = <TValue, TView extends DateOrTimeView>(
  props: PickersLayoutProps<TValue, TView>,
): UsePickerLayoutResponse => {
  const {
    wrapperVariant,
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    view,
    views,
    onViewChange,
    value,
    onChange,
    isValid,
    isLandscape,
    disabled,
    readOnly,
    showToolbar,
    children,
    components,
    componentsProps,
  } = props;

  const classes = useUtilityClasses(props);
  // Action bar

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: componentsProps?.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions:
        wrapperVariant === 'desktop' ? [] : (['cancel', 'accept'] as PickersActionBarAction[]),
      className: classes.actionBar,
    },
    ownerState: { ...props, wrapperVariant },
  });
  const actionBar = <ActionBar {...actionBarProps} />;

  // Toolbar

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;
  const toolbarProps = useSlotProps({
    elementType: Toolbar!,
    externalSlotProps: componentsProps?.toolbar,
    additionalProps: {
      isLandscape,
      onChange,
      value,
      view,
      onViewChange,
      views,
      disabled,
      readOnly,
      className: classes.toolbar,
    },
    ownerState: { ...props, wrapperVariant },
  });
  const toolbar = view && shouldRenderToolbar && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;

  // Content

  const content = children;

  // Tabs

  const Tabs = components?.Tabs;
  const tabs =
    view && Tabs ? (
      <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />
    ) : null;

  // Shortcuts

  const Shortcuts = components?.Shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: componentsProps?.shortcuts,
    additionalProps: {
      isValid,
      isLandscape,
      onChange,
      value,
      view,
      onViewChange,
      views,
      disabled,
      readOnly,
      className: classes.shortcuts,
    },
    ownerState: { ...props, wrapperVariant },
  });

  const shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsProps} /> : null;

  return {
    toolbar,
    content,
    tabs,
    actionBar,
    shortcuts,
  };
};

export default usePickerLayout;
