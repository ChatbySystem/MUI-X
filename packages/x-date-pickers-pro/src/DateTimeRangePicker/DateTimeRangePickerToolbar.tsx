'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  BaseToolbarProps,
  ExportedBaseToolbarProps,
  useUtils,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  usePickersPrivateContext,
} from '@mui/x-date-pickers/internals';
import { usePickersContext, usePickersTranslations } from '@mui/x-date-pickers/hooks';
import { PickerOwnerState, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DateTimePickerToolbarProps,
  DateTimePickerToolbar,
} from '@mui/x-date-pickers/DateTimePicker';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  DateTimeRangePickerToolbarClasses,
  getDateTimeRangePickerToolbarUtilityClass,
} from './dateTimeRangePickerToolbarClasses';
import { calculateRangeChange } from '../internals/utils/date-range-manager';

const useUtilityClasses = (classes: Partial<DateTimeRangePickerToolbarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    startToolbar: ['startToolbar'],
    endToolbar: ['endToolbar'],
  };

  return composeClasses(slots, getDateTimeRangePickerToolbarUtilityClass, classes);
};

type DateTimeRangeViews = Exclude<DateOrTimeViewWithMeridiem, 'year' | 'month'>;

export interface DateTimeRangePickerToolbarProps
  extends BaseToolbarProps<PickerRangeValue, DateTimeRangeViews>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'>,
    ExportedDateTimeRangePickerToolbarProps {
  ampm?: boolean;
}

export interface ExportedDateTimeRangePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimeRangePickerToolbarClasses>;
}

const DateTimeRangePickerToolbarRoot = styled('div', {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: PickerOwnerState;
}>({
  display: 'flex',
  flexDirection: 'column',
});

interface DateTimeRangePickerStartOrEndToolbarProps extends DateTimePickerToolbarProps {
  ownerState?: PickerOwnerState;
}

type DateTimeRangePickerStartOrEndToolbarComponent = (
  props: DateTimeRangePickerStartOrEndToolbarProps,
) => React.JSX.Element;

const DateTimeRangePickerToolbarStart = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'StartToolbar',
  overridesResolver: (_, styles) => styles.startToolbar,
})<DateTimeRangePickerStartOrEndToolbarProps>({
  borderBottom: 'none',
  variants: [
    {
      props: { pickerVariant: 'mobile' },
      style: {
        padding: '12px 8px 0 12px',
      },
    },
    {
      props: { pickerVariant: 'desktop' },
      style: {
        paddingBottom: 0,
      },
    },
  ],
}) as DateTimeRangePickerStartOrEndToolbarComponent;

const DateTimeRangePickerToolbarEnd = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'EndToolbar',
  overridesResolver: (_, styles) => styles.endToolbar,
})<DateTimeRangePickerStartOrEndToolbarProps>({
  variants: [
    {
      props: { pickerVariant: 'mobile' },
      style: {
        padding: '12px 8px 12px 12px',
      },
    },
  ],
}) as DateTimeRangePickerStartOrEndToolbarComponent;

type DateTimeRangePickerToolbarComponent = ((
  props: DateTimeRangePickerToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const DateTimeRangePickerToolbar = React.forwardRef(function DateTimeRangePickerToolbar(
  inProps: DateTimeRangePickerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerToolbar' });
  const utils = useUtils();

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    className,
    onViewChange,
    onChange,
    classes: classesProp,
    view,
    views,
    ampm,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
    titleId,
    sx,
    ...other
  } = props;

  const translations = usePickersTranslations();
  const { ownerState } = usePickersPrivateContext();
  const { disabled, readOnly } = usePickersContext();
  const classes = useUtilityClasses(classesProp);

  const commonToolbarProps = {
    views,
    ampm,
    disabled,
    readOnly,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
  };

  const handleStartRangeViewChange = React.useCallback(
    (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'start') {
        onRangePositionChange('start');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleEndRangeViewChange = React.useCallback(
    (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'end') {
        onRangePositionChange('end');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleOnChange = React.useCallback(
    (newDate: PickerValidDate | null) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: props.value,
        rangePosition,
        allowRangeFlip: true,
      });
      onRangePositionChange(nextSelection);
      onChange(newRange);
    },
    [onChange, onRangePositionChange, props.value, rangePosition, utils],
  );

  if (hidden) {
    return null;
  }

  return (
    <DateTimeRangePickerToolbarRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      sx={sx}
      {...other}
    >
      <DateTimeRangePickerToolbarStart
        value={start}
        onViewChange={handleStartRangeViewChange}
        toolbarTitle={translations.start}
        ownerState={ownerState}
        view={rangePosition === 'start' ? view : undefined}
        className={classes.startToolbar}
        onChange={handleOnChange}
        titleId={titleId ? `${titleId}-start-toolbar` : undefined}
        {...commonToolbarProps}
      />
      <DateTimeRangePickerToolbarEnd
        value={end}
        onViewChange={handleEndRangeViewChange}
        toolbarTitle={translations.end}
        ownerState={ownerState}
        view={rangePosition === 'end' ? view : undefined}
        className={classes.endToolbar}
        onChange={handleOnChange}
        titleId={titleId ? `${titleId}-end-toolbar` : undefined}
        {...commonToolbarProps}
      />
    </DateTimeRangePickerToolbarRoot>
  );
}) as DateTimeRangePickerToolbarComponent;

DateTimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  titleId: PropTypes.string,
  /**
   * Toolbar date format.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  ).isRequired,
} as any;

export { DateTimeRangePickerToolbar };
