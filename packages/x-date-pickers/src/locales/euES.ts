import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
    hours: 'orduak',
    minutes: 'minutuak',
    seconds: 'segunduak',
    meridiem: 'meridianoa',
};

const euESPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Azken hilabetea',
  nextMonth: 'Hurrengo hilabetea',

  // View navigation
  openPreviousView: 'azken bista ireki',
  openNextView: 'hurrengo bista ireki',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'urteko bista irekita dago, aldatu egutegi bistara'
      : 'egutegi bista irekita dago, aldatu urteko bistara',

  // DateRange placeholders
  start: 'Hasi',
  end: 'Bukatu',

  // Action bar
  cancelButtonLabel: 'Utxi',
  clearButtonLabel: 'Garbitu',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Gaur',

  // Toolbar titles
  datePickerToolbarTitle: 'Data aukeratu',
  dateTimePickerToolbarTitle: 'Data eta ordua aukeratu',
  timePickerToolbarTitle: 'Ordua aukeratu',
  dateRangePickerToolbarTitle: 'Data tartea aukeratu',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Aukeratu ${views[view]}. ${
      time === null
        ? 'Denbora aukeraketarik gabe'
        : `Aukeratutako denbora ${adapter.format(time, 'fullTime')} da`
    }`,
  hoursClockNumberText: (hours) => `${hours} ordu`,
  minutesClockNumberText: (minutes) => `${minutes} minutu`,
  secondsClockNumberText: (seconds) => `${seconds} segundu`,

  // Digital clock labels
  selectViewText: (view) => `Aukeratu ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Astea zenbakia',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber} astea`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Aukeratu data, aukeratutako data ${utils.format(value, 'fullDate')} da`
      : 'Aukeratu data',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Aukeratu ordua, aukeratutako ordua ${utils.format(value, 'fullTime')} da`
      : 'Aukeratu ordua',
  // fieldClearLabel: 'Clear value',

  // Table labels
  timeTableLabel: 'aukeratu data',
  dateTableLabel: 'aukeratu ordua',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const euES = getPickersLocalization(euESPickers);
