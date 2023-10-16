import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'las horas',
  minutes: 'los minutos',
  seconds: 'los segundos',
  meridiem: 'meridiano',
};

const esESPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Último mes',
  nextMonth: 'Próximo mes',

  // View navigation
  openPreviousView: 'Abrir la última vista',
  openNextView: 'Abrir la siguiente vista',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'la vista del año está abierta, cambie a la vista de calendario'
      : 'la vista de calendario está abierta, cambie a la vista del año',

  // DateRange labels
  start: 'Empezar',
  end: 'Terminar',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpiar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoy',

  // Toolbar titles
  datePickerToolbarTitle: 'Seleccionar fecha',
  dateTimePickerToolbarTitle: 'Seleccionar fecha y hora',
  timePickerToolbarTitle: 'Seleccionar hora',
  dateRangePickerToolbarTitle: 'Seleccionar rango de fecha',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Seleccione ${views[view]}. ${
      time === null
        ? 'Sin tiempo seleccionado'
        : `El tiempo seleccionado es ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} horas`,
  minutesClockNumberText: (minutes) => `${minutes} minutos`,
  secondsClockNumberText: (seconds) => `${seconds} segundos`,

  // Digital clock labels
  selectViewText: (view) => `Seleccionar ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Número de semana',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Semana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Elige la fecha, la fecha elegida es ${utils.format(value, 'fullDate')}`
      : 'Elige la fecha',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Elige la hora, la hora elegido es ${utils.format(value, 'fullTime')}`
      : 'Elige la hora',
  // fieldClearLabel: 'Clear value',

  // Table labels
  timeTableLabel: 'elige la fecha',
  dateTableLabel: 'elige la hora',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'A'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const esES = getPickersLocalization(esESPickers);
