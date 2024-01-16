import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  StaticDateTimePicker,
  StaticDateTimePickerProps,
} from '@mui/x-date-pickers/StaticDateTimePicker';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/internals/models';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
// eslint-disable-next-line no-restricted-imports
import { isDatePickerView } from '@mui/x-date-pickers/internals/utils/date-utils';
// eslint-disable-next-line no-restricted-imports
import { isTimeView } from '@mui/x-date-pickers/internals/utils/time-utils';

const ComponentSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflowX: 'auto',
  '& .MuiPickersLayout-root': {
    borderRadius: 6,
    border: '1px dashed',
    borderColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : alpha(theme.palette.grey[500], 0.1),
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: alpha(theme.palette.grey[900], 0.2),
    }),
  },
}));

const PropControlsSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: alpha(theme.palette.grey[50], 0.5),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: alpha(theme.palette.grey[900], 0.3),
  }),
}));

function RadioGroupControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value === '' ? undefined : event.target.value === 'true');
    },
    [onChange],
  );
  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup aria-labelledby={id} value={value ?? ''} onChange={handleChange} row>
        <FormControlLabel value={''} control={<Radio />} label="undefined" />
        <FormControlLabel value control={<Radio />} label="true" />
        <FormControlLabel value={false} control={<Radio />} label="false" />
      </RadioGroup>
    </FormControl>
  );
}

function BooleanGroupControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    },
    [onChange],
  );
  return (
    <FormControl
      size="small"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
      }}
    >
      <FormLabel id={id}>{label}</FormLabel>
      <Switch checked={value} onChange={handleChange} />
    </FormControl>
  );
}

type ViewsMap = Record<DateOrTimeView, boolean>;

const DEFAULT_VIEWS_MAP: ViewsMap = {
  year: true,
  month: false,
  day: true,
  hours: true,
  minutes: true,
  seconds: false,
};

type ComponentFamily = 'date' | 'time' | 'date-time' | 'date-range';

const componentFamilies: { family: ComponentFamily; label: string }[] = [
  { family: 'date', label: 'Date' },
  { family: 'time', label: 'Time' },
  { family: 'date-time', label: 'Date Time' },
  { family: 'date-range', label: 'Date Range' },
];

interface ComponentFamilySet {
  name: string;
  component: React.ElementType;
  props: Record<string, any>;
}

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

function DisabledCheckboxTooltip({ children }: { children: React.ReactElement }) {
  return (
    <Tooltip title="At least one view has to be provided to the components">{children}</Tooltip>
  );
}

function ViewCheckbox({
  onlyOneView,
  name,
  ...other
}: Pick<CheckboxProps, 'onChange' | 'name' | 'checked'> & {
  onlyOneView: boolean;
}) {
  const isDisabled = other.checked && onlyOneView;
  const Wrapper = isDisabled ? DisabledCheckboxTooltip : React.Fragment;
  return (
    <Wrapper>
      <FormControlLabel
        control={<Checkbox name={name} {...other} disabled={isDisabled} size="small" />}
        label={name}
        sx={{ textTransform: 'capitalize' }}
      />
    </Wrapper>
  );
}

function ViewSwitcher({
  showDateViews,
  showTimeViews,
  views,
  handleViewsChange,
}: {
  showDateViews: boolean;
  showTimeViews: boolean;
  views: ViewsMap;
  handleViewsChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}) {
  const relevantViews = React.useMemo(
    () =>
      Object.entries(views).filter(
        ([view]) =>
          (showDateViews && isDatePickerView(view as DateOrTimeView)) ||
          (showTimeViews && isTimeView(view as DateOrTimeView)),
      ),
    [showDateViews, showTimeViews, views],
  );
  const onlyOneView = React.useMemo(
    () => relevantViews.filter(([, enabled]) => Boolean(enabled)).length === 1,
    [relevantViews],
  );

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel id="views-label" component="legend">
        Available views
      </FormLabel>
      <FormGroup
        row
        aria-labelledby="views-label"
        sx={{
          columnGap: 1.5,
          [`& .${formControlLabelClasses.root}`]: {
            marginRight: 0,
          },
        }}
      >
        {showDateViews && (
          <React.Fragment>
            <ViewCheckbox
              name="year"
              checked={views.year}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
            <ViewCheckbox
              name="month"
              checked={views.month}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
            <ViewCheckbox
              name="day"
              checked={views.day}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
          </React.Fragment>
        )}
        {showTimeViews && (
          <React.Fragment>
            <ViewCheckbox
              name="hours"
              checked={views.hours}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
            <ViewCheckbox
              name="minutes"
              checked={views.minutes}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
            <ViewCheckbox
              name="seconds"
              checked={views.seconds}
              onlyOneView={onlyOneView}
              onChange={handleViewsChange}
            />
          </React.Fragment>
        )}
      </FormGroup>
    </FormControl>
  );
}

export default function PickersPlayground() {
  const [isToolbarHidden, setIsToolbarHidden] = React.useState<boolean | undefined>();
  const [isTabsHidden, setIsTabsHidden] = React.useState<boolean | undefined>();
  const [showDaysOutsideCurrentMonth, setShowDaysOutsideCurrentMonth] =
    React.useState<boolean>(false);
  const [displayWeekNumber, setDisplayWeekNumber] = React.useState<boolean>(false);
  const [fixed6Weeks, setFixed6Weeks] = React.useState<boolean>(false);
  const [disableDayMargin, setDisableDayMargin] = React.useState<boolean>(false);
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [isStaticDesktopMode, setIsStaticDesktopMode] = React.useState<boolean>(false);
  const [ampm, setAmpm] = React.useState<boolean | undefined>();
  const [ampmInClock, setAmpmInClock] = React.useState<boolean | undefined>();
  const [singleCalendar, setSingleCalendar] = React.useState<boolean>(false);
  const [customActions, setCustomActions] = React.useState<boolean>(false);
  const [displayShortcuts, setDisplayShortcuts] = React.useState<boolean>(false);
  const [views, setViews] = React.useState(DEFAULT_VIEWS_MAP);
  const [selectedPickers, setSelectedPickers] = React.useState<ComponentFamily>('date');

  const handleViewsChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setViews((currentViews) => ({
      ...currentViews,
      [event.target.name]: event.target.checked,
    }));
  }, []);

  const availableViews = React.useMemo(
    () =>
      Object.entries(views).reduce((acc, [view, available]) => {
        if (available) {
          acc.push(view as DateOrTimeView);
        }
        return acc;
      }, [] as DateOrTimeView[]),
    [views],
  );
  const dateViews = React.useMemo(() => availableViews.filter(isDatePickerView), [availableViews]);
  const timeViews = React.useMemo(() => availableViews.filter(isTimeView), [availableViews]);

  const commonProps = React.useMemo<StaticDateTimePickerProps<Dayjs>>(
    () => ({
      orientation: isLandscape ? 'landscape' : 'portrait',
      showDaysOutsideCurrentMonth,
      slotProps: {
        ...(isToolbarHidden !== undefined && {
          toolbar: {
            hidden: isToolbarHidden,
          },
        }),
        ...(isTabsHidden !== undefined && {
          tabs: {
            hidden: isTabsHidden,
          },
        }),
        ...(!!customActions && {
          actionBar: {
            actions: ['clear', 'today', 'cancel', 'accept'],
          },
        }),
        day: {
          disableMargin: disableDayMargin,
        },
      },
      displayWeekNumber,
      fixedWeekNumber: fixed6Weeks ? 6 : undefined,
      ampm: ampm !== undefined ? ampm : undefined,
      ampmInClock: ampmInClock !== undefined ? ampmInClock : undefined,
      displayStaticWrapperAs: isStaticDesktopMode ? 'desktop' : 'mobile',
    }),
    [
      ampm,
      ampmInClock,
      customActions,
      disableDayMargin,
      displayWeekNumber,
      fixed6Weeks,
      isLandscape,
      isStaticDesktopMode,
      isTabsHidden,
      isToolbarHidden,
      showDaysOutsideCurrentMonth,
    ],
  );

  const datePickerProps = React.useMemo(
    () => ({
      ...commonProps,
      views: dateViews,
    }),
    [commonProps, dateViews],
  );

  const timePickerProps = React.useMemo(
    () => ({
      ...commonProps,
      views: timeViews,
    }),
    [commonProps, timeViews],
  );

  const DATE_PICKERS: ComponentFamilySet[] = React.useMemo(
    () => [
      {
        name: 'DesktopDatePicker',
        component: DesktopDatePicker,
        props: datePickerProps,
      },
      {
        name: 'MobileDatePicker',
        component: MobileDatePicker,
        props: datePickerProps,
      },
      {
        name: 'StaticDatePicker',
        component: StaticDatePicker,
        props: datePickerProps,
      },
    ],
    [datePickerProps],
  );

  const TIME_PICKERS: ComponentFamilySet[] = React.useMemo(
    () => [
      {
        name: 'DesktopTimePicker',
        component: DesktopTimePicker,
        props: timePickerProps,
      },
      {
        name: 'MobileTimePicker',
        component: MobileTimePicker,
        props: timePickerProps,
      },
      {
        name: 'StaticTimePicker',
        component: StaticTimePicker,
        props: timePickerProps,
      },
    ],
    [timePickerProps],
  );

  const DATE_TIME_PICKERS: ComponentFamilySet[] = React.useMemo(
    () => [
      {
        name: 'DesktopDateTimePicker',
        component: DesktopDateTimePicker,
        props: commonProps,
      },
      {
        name: 'MobileDateTimePicker',
        component: MobileDateTimePicker,
        props: commonProps,
      },
      {
        name: 'StaticDateTimePicker',
        component: StaticDateTimePicker,
        props: commonProps,
      },
    ],
    [commonProps],
  );

  const DATE_RANGE_PICKERS: ComponentFamilySet[] = React.useMemo(
    () => [
      {
        name: 'DesktopDateRangePicker',
        component: DesktopDateRangePicker,
        props: commonProps,
      },
      {
        name: 'MobileDateRangePicker',
        component: MobileDateRangePicker,
        props: commonProps,
      },
      {
        name: 'StaticDateRangePicker',
        component: StaticDateRangePicker,
        props: commonProps,
      },
    ],
    [commonProps],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <ComponentSection sx={{ width: { xs: '100%', sm: '60%' } }}>
          <FormControl fullWidth>
            <InputLabel id="selected-component-family-label">Selected components</InputLabel>
            <Select
              labelId="selected-component-family-label"
              id="selected-component-family"
              value={selectedPickers}
              onChange={(event) => setSelectedPickers(event.target.value as ComponentFamily)}
              label="Selected components"
            >
              {componentFamilies.map((componentFamily) => (
                <MenuItem key={componentFamily.family} value={componentFamily.family}>
                  {componentFamily.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedPickers === 'date' && (
            <DemoContainer
              components={['DesktopDatePicker', 'MobileDatePicker', 'StaticDatePicker']}
              sx={{ flexGrow: 1 }}
            >
              {DATE_PICKERS.map(({ name, component: Component, props }) => (
                <Component label={name} key={name} {...props} />
              ))}
            </DemoContainer>
          )}
          {selectedPickers === 'time' && (
            <DemoContainer
              components={['DesktopTimePicker', 'MobileTimePicker', 'StaticTimePicker']}
              sx={{ flexGrow: 1 }}
            >
              {TIME_PICKERS.map(({ name, component: Component, props }) => (
                <Component label={name} key={name} {...props} />
              ))}
            </DemoContainer>
          )}
          {selectedPickers === 'date-time' && (
            <DemoContainer
              components={['DesktopDateTimePicker', 'MobileDateTimePicker', 'StaticDateTimePicker']}
              sx={{ flexGrow: 1 }}
            >
              {DATE_TIME_PICKERS.map(({ name, component: Component, props }) => (
                <Component label={name} key={name} views={availableViews} {...props} />
              ))}
            </DemoContainer>
          )}
          {selectedPickers === 'date-range' && (
            <DemoContainer
              components={[
                'DesktopDateRangePicker',
                'MobileDateRangePicker',
                'StaticDateRangePicker',
              ]}
              sx={{ flexGrow: 1 }}
            >
              {DATE_RANGE_PICKERS.map(({ name, component: Component, props }) => (
                <Component
                  key={name}
                  label={name}
                  calendars={singleCalendar ? 1 : undefined}
                  {...props}
                  slotProps={{
                    ...props.slotProps,
                    ...(displayShortcuts && {
                      shortcuts: {
                        items: shortcutsItems,
                      },
                    }),
                  }}
                />
              ))}
            </DemoContainer>
          )}
        </ComponentSection>
        <Divider orientation="vertical" light sx={{ display: { xs: 'none', sm: 'flex' } }} />
        <Divider light sx={{ display: { xs: 'auto', sm: 'none' } }} />
        <PropControlsSection>
          <Typography
            id="usage-props"
            component="h3"
            fontWeight="600"
            sx={{
              scrollMarginTop: 160,
              fontFamily: 'General Sans',
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Playground
          </Typography>
          <Divider light />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2, pl: 3, pr: 2 }}>
            <BooleanGroupControl
              label="Static desktop mode"
              value={isStaticDesktopMode}
              onChange={setIsStaticDesktopMode}
            />
            <RadioGroupControl
              label="Toolbar hidden"
              value={isToolbarHidden}
              onChange={setIsToolbarHidden}
            />
            {selectedPickers === 'date-time' && (
              <RadioGroupControl
                label="Tabs hidden"
                value={isTabsHidden}
                onChange={setIsTabsHidden}
              />
            )}
            <BooleanGroupControl
              label="Show days outside current month"
              value={showDaysOutsideCurrentMonth}
              onChange={setShowDaysOutsideCurrentMonth}
            />
            <BooleanGroupControl
              label="Fixed 6 weeks"
              value={fixed6Weeks}
              onChange={setFixed6Weeks}
            />
            <BooleanGroupControl
              label="Display week number"
              value={displayWeekNumber}
              onChange={setDisplayWeekNumber}
            />
            {selectedPickers !== 'date-range' && (
              <BooleanGroupControl
                label="Disable day margin"
                value={disableDayMargin}
                onChange={setDisableDayMargin}
              />
            )}
            {(selectedPickers === 'time' || selectedPickers === 'date-time') && (
              <React.Fragment>
                <RadioGroupControl label="AM/PM" value={ampm} onChange={setAmpm} />
                <RadioGroupControl
                  label="ampmInClock"
                  value={ampmInClock}
                  onChange={setAmpmInClock}
                />
              </React.Fragment>
            )}
            {selectedPickers === 'date-range' && (
              <React.Fragment>
                <BooleanGroupControl
                  label="Single calendar"
                  value={singleCalendar}
                  onChange={setSingleCalendar}
                />
                <BooleanGroupControl
                  label="Display shortcuts"
                  value={displayShortcuts}
                  onChange={setDisplayShortcuts}
                />
              </React.Fragment>
            )}
            <BooleanGroupControl
              label="Custom actions"
              value={customActions}
              onChange={setCustomActions}
            />
            <BooleanGroupControl
              label="Landscape orientation"
              value={isLandscape}
              onChange={setIsLandscape}
            />
            {selectedPickers !== 'date-range' && (
              <ViewSwitcher
                showDateViews={selectedPickers === 'date' || selectedPickers === 'date-time'}
                showTimeViews={selectedPickers === 'time' || selectedPickers === 'date-time'}
                views={views}
                handleViewsChange={handleViewsChange}
              />
            )}
          </Box>
        </PropControlsSection>
      </Box>
    </LocalizationProvider>
  );
}
