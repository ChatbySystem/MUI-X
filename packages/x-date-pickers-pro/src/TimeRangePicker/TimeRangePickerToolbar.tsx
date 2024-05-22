import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  PickersToolbar,
  PickersToolbarButton,
  useUtils,
  BaseToolbarProps,
  useLocaleText,
  ExportedBaseToolbarProps,
  WrapperVariant,
  TimeViewWithMeridiem,
  PickersToolbarText,
  getMeridiem,
  formatMeridiem,
  MakeOptional,
  pickersToolbarClasses,
  pickersToolbarTextClasses,
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
    separator: ['separator'],
    timeContainer: ['timeContainer'],
  };

  return composeClasses(slots, getTimeRangePickerToolbarUtilityClass, classes);
};

export interface TimeRangePickerToolbarProps<TDate extends PickerValidDate>
  extends Omit<BaseToolbarProps<DateRange<TDate>, TimeViewWithMeridiem>, 'toolbarFormat'>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'>,
    ExportedTimeRangePickerToolbarProps {
  ampm: boolean;
  toolbarVariant?: WrapperVariant;
}

export interface ExportedTimeRangePickerToolbarProps
  extends Omit<ExportedBaseToolbarProps, 'toolbarFormat'> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeRangePickerToolbarClasses>;
}

const TimeRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: TimeRangePickerToolbarProps<any> }>(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  padding: '12px 0px 8px 0px',
  [`& .${pickersToolbarClasses.content} .${pickersToolbarTextClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
  '& > :first-child': {
    paddingLeft: 12,
  },
}));

const TimeRangePickerToolbarContainer = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  rowGap: 8,
});

const TimeRangePickerToolbarTimeContainer = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (_, styles) => styles.timeContainer,
})({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const TimeRangePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({
  cursor: 'default',
});

type TimeRangePickerToolbarTimeElementProps<TDate extends PickerValidDate> = MakeOptional<
  Pick<
    TimeRangePickerToolbarProps<TDate>,
    'ampm' | 'views' | 'onViewChange' | 'view' | 'toolbarPlaceholder' | 'toolbarVariant'
  >,
  'view'
> & {
  value: TDate | null;
  utils: MuiPickersAdapter<TDate, any>;
  separatorClasses: string;
};

function TimeRangePickerToolbarTimeElement<TDate extends PickerValidDate>(
  props: TimeRangePickerToolbarTimeElementProps<TDate>,
) {
  const {
    value,
    ampm,
    views,
    onViewChange,
    view,
    utils,
    separatorClasses,
    toolbarPlaceholder,
    toolbarVariant,
  } = props;

  const formatHours = (time: TDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');
  const meridiemMode = getMeridiem(value, utils);
  const sectionWidth = toolbarVariant === 'desktop' ? 48 : '100%';

  return (
    <TimeRangePickerToolbarTimeContainer>
      {views.includes('hours') && (
        <React.Fragment>
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('hours')}
            selected={view === 'hours'}
            value={value ? formatHours(value) : toolbarPlaceholder}
          />
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses} />
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('minutes')}
            selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')}
            value={value ? utils.format(value, 'minutes') : toolbarPlaceholder}
            disabled={!views.includes('minutes')}
          />
        </React.Fragment>
      )}

      {views.includes('seconds') && (
        <React.Fragment>
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses} />
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('seconds')}
            selected={view === 'seconds'}
            value={value ? utils.format(value, 'seconds') : toolbarPlaceholder}
          />
        </React.Fragment>
      )}

      {ampm && (
        <PickersToolbarButton
          variant="h5"
          onClick={() => onViewChange('meridiem')}
          selected={view === 'meridiem'}
          value={value && meridiemMode ? formatMeridiem(utils, meridiemMode) : toolbarPlaceholder}
          width={sectionWidth}
        />
      )}
    </TimeRangePickerToolbarTimeContainer>
  );
}

const TimeRangePickerToolbar = React.forwardRef(function TimeRangePickerToolbar<
  TDate extends PickerValidDate,
>(inProps: TimeRangePickerToolbarProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const utils = useUtils<TDate>();
  const props = useThemeProps({ props: inProps, name: 'MuiTimeRangePickerToolbar' });

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    className,
    ampm,
    views,
    toolbarVariant = 'mobile',
    toolbarPlaceholder = '--',
    onViewChange,
    view,
    ...other
  } = props;

  const localeText = useLocaleText<TDate>();

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const handleStartRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'start') {
        onRangePositionChange('start');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleEndRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'end') {
        onRangePositionChange('end');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  return (
    <TimeRangePickerToolbarRoot
      {...other}
      toolbarTitle={localeText.timeRangePickerToolbarTitle}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      ref={ref}
    >
      <TimeRangePickerToolbarContainer className={classes.container}>
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'start' ? view : undefined}
          views={views}
          value={start}
          onViewChange={handleStartRangeViewChange}
          ampm={ampm}
          utils={utils}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
          toolbarVariant={toolbarVariant}
        />
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'end' ? view : undefined}
          views={views}
          value={end}
          onViewChange={handleEndRangeViewChange}
          ampm={ampm}
          utils={utils}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
          toolbarVariant={toolbarVariant}
        />
      </TimeRangePickerToolbarContainer>
    </TimeRangePickerToolbarRoot>
  );
});

TimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
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
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired)
    .isRequired,
} as any;

export { TimeRangePickerToolbar };
