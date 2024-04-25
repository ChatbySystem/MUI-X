import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickerValidDate, TimeView } from '@mui/x-date-pickers/models';
import {
  PickersToolbar,
  PickersToolbarButton,
  useUtils,
  BaseToolbarProps,
  useLocaleText,
  ExportedBaseToolbarProps,
  resolveTimeFormat,
  WrapperVariant,
} from '@mui/x-date-pickers/internals';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  TimeRangePickerToolbarClasses,
  getTimeRangePickerToolbarUtilityClass,
} from './timeRangePickerToolbarClasses';
import { DateRange } from '../models';

const useUtilityClasses = (ownerState: TimeRangePickerToolbarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getTimeRangePickerToolbarUtilityClass, classes);
};

export interface TimeRangePickerToolbarProps<TDate extends PickerValidDate>
  extends BaseToolbarProps<DateRange<TDate>, TimeView>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {
  ampm: boolean;
  ampmInClock: boolean;
  toolbarVariant?: WrapperVariant;
  classes?: Partial<TimeRangePickerToolbarClasses>;
}

export interface ExportedTimeRangePickerToolbarProps extends ExportedBaseToolbarProps {
  ampm?: boolean;
  ampmInClock?: boolean;
}

const TimeRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: TimeRangePickerToolbarProps<any>;
}>(({ theme, ownerState }) => ({
  ...(ownerState.toolbarVariant === 'mobile'
    ? { borderBottom: `1px solid ${(theme.vars || theme).palette.divider}` }
    : { padding: 0 }),
}));

const TimeRangePickerToolbarContainer = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const TimeRangePickerToolbarMobileRoot = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'MobileRoot',
  overridesResolver: (_, styles) => styles.container,
})({ padding: '16px 24px' });

const TimeRangePickerToolbar = React.forwardRef(function TimeRangePickerToolbar<
  TDate extends PickerValidDate,
>(inProps: TimeRangePickerToolbarProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const utils = useUtils<TDate>();
  const props = useThemeProps({ props: inProps, name: 'MuiTimeRangePickerToolbar' });

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    toolbarFormat,
    className,
    ampm,
    ampmInClock,
    views,
    toolbarVariant = 'mobile',
    toolbarPlaceholder = '--:--',
    ...other
  } = props;

  const localeText = useLocaleText<TDate>();

  const format = React.useMemo(() => {
    if (toolbarFormat) {
      return toolbarFormat;
    }

    return resolveTimeFormat(utils, { format: undefined, ampm, views: views as TimeView[] });
  }, [utils, toolbarFormat, ampm, views]);

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  if (toolbarVariant === 'desktop') {
    const startDateValue = start ? utils.formatByString(start, format) : toolbarPlaceholder;
    const endDateValue = end ? utils.formatByString(end, format) : toolbarPlaceholder;

    return (
      <TimeRangePickerToolbarMobileRoot className={className}>
        <TimeRangePickerToolbarRoot
          {...other}
          toolbarTitle={localeText.from}
          ownerState={ownerState}
          ref={ref}
        >
          <PickersToolbarButton
            variant={start !== null ? 'h5' : 'h6'}
            value={startDateValue}
            selected={rangePosition === 'start'}
            onClick={() => onRangePositionChange('start')}
          />
        </TimeRangePickerToolbarRoot>
        <TimeRangePickerToolbarRoot
          {...other}
          toolbarTitle={localeText.to}
          ownerState={ownerState}
          ref={ref}
        >
          <PickersToolbarButton
            variant={end !== null ? 'h5' : 'h6'}
            value={endDateValue}
            selected={rangePosition === 'end'}
            onClick={() => onRangePositionChange('end')}
          />
        </TimeRangePickerToolbarRoot>
      </TimeRangePickerToolbarMobileRoot>
    );
  }

  const startDateValue = start ? utils.formatByString(start, format) : localeText.start;
  const endDateValue = end ? utils.formatByString(end, format) : localeText.end;

  return (
    <TimeRangePickerToolbarRoot
      {...other}
      toolbarTitle={localeText.timeRangePickerToolbarTitle}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      ref={ref}
    >
      <TimeRangePickerToolbarContainer className={classes.container}>
        <PickersToolbarButton
          variant={start !== null ? 'h5' : 'h6'}
          value={startDateValue}
          selected={rangePosition === 'start'}
          onClick={() => onRangePositionChange('start')}
        />
        <Typography variant="h5">&nbsp;{'–'}&nbsp;</Typography>
        <PickersToolbarButton
          variant={end !== null ? 'h5' : 'h6'}
          value={endDateValue}
          selected={rangePosition === 'end'}
          onClick={() => onRangePositionChange('end')}
        />
      </TimeRangePickerToolbarContainer>
    </TimeRangePickerToolbarRoot>
  );
});

TimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool.isRequired,
  ampmInClock: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  readOnly: PropTypes.bool,
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
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired).isRequired,
} as any;

export { TimeRangePickerToolbar };
