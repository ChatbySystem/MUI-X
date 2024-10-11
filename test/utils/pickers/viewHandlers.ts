import { act, fireTouchChangedEvent, screen } from '@mui/internal-test-utils';
import { getClockTouchEvent, formatFullTimeValue } from 'test/utils/pickers';
import { MuiPickersAdapter, TimeView } from '@mui/x-date-pickers/models';
import { formatMeridiem } from '@mui/x-date-pickers/internals';
import userEvent from '@testing-library/user-event';

type TDate = any;

interface ViewHandler<TView> {
  setViewValue: (utils: MuiPickersAdapter<any>, viewValue: TDate, view?: TView) => Promise<void>;
}

export const timeClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (adapter, value, view) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();

    let valueInt;
    let clockView;

    if (view === 'hours') {
      valueInt = adapter.getHours(value);
      clockView = hasMeridiem ? '12hours' : '24hours';
    } else if (view === 'minutes') {
      valueInt = adapter.getMinutes(value);
      clockView = 'minutes';
    } else {
      throw new Error('View not supported');
    }

    const hourClockEvent = getClockTouchEvent(valueInt, clockView);

    await act(async () => {
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchmove', hourClockEvent);
    });
    await act(async () => {
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchend', hourClockEvent);
    });
  },
};

export const digitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (adapter, value) => {
    await userEvent.click(
      screen.getByRole('option', { name: formatFullTimeValue(adapter, value) }),
    );
  },
};

export const multiSectionDigitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (adapter, value) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();
    const hoursLabel = parseInt(adapter.format(value, hasMeridiem ? 'hours12h' : 'hours24h'), 10);
    const minutesLabel = adapter.getMinutes(value).toString();
    await userEvent.click(screen.getByRole('option', { name: `${hoursLabel} hours` }));
    await userEvent.click(screen.getByRole('option', { name: `${minutesLabel} minutes` }));
    if (hasMeridiem) {
      await userEvent.click(
        screen.getByRole('option', {
          name: formatMeridiem(adapter, adapter.getHours(value) >= 12 ? 'pm' : 'am'),
        }),
      );
    }
  },
};
