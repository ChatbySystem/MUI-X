import * as React from 'react';
import { expect } from 'chai';
import { screen, fireEvent } from '@mui/monorepo/test/utils';
import { CalendarPicker, CalendarPickerProps } from '@mui/x-date-pickers/CalendarPicker';
import { createPickerRenderer, adapterToUse } from '../../../../../test/utils/pickers-utils';

const WrappedCalendarPicker = <TDate extends any>(
  props: Omit<CalendarPickerProps<TDate>, 'value' | 'onChange'> & { initialValue: TDate },
) => {
  const { initialValue, ...other } = props;

  const [value, setValue] = React.useState<TDate | null>(initialValue);

  const handleChange = React.useCallback((newValue: TDate | null) => {
    setValue(newValue);
  }, []);

  return <CalendarPicker {...other} value={value} onChange={handleChange} />;
};

describe('<CalendarPicker /> - Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  // Test about `shouldDisableMonth` on the "month" view is on the `MonthPicker` test file.
  describe('props.shouldDisableMonth', () => {
    it('should disable all the dates on the "day" view when `shouldDisableMonth` returns false for its month`', () => {
      render(
        <WrappedCalendarPicker
          initialValue={adapterToUse.date(new Date(2018, 5, 1))}
          shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 6}
          views={['day']}
          openTo={'day'}
        />,
      );

      // No date should be disabled in the month before the disabled month
      screen.getAllByMuiTest('day').forEach((day) => {
        expect(day).not.to.have.attribute('disabled');
      });

      fireEvent.click(screen.getByTitle('Next month'));
      clock.runToLast();

      // All dates should be disabled in disabled month
      screen.getAllByMuiTest('day').forEach((day) => {
        expect(day).to.have.attribute('disabled');
      });

      fireEvent.click(screen.getByTitle('Next month'));
      clock.runToLast();

      // No date should be disabled in the month after the disabled month
      screen.getAllByMuiTest('day').forEach((day) => {
        expect(day).not.to.have.attribute('disabled');
      });
    });
  });

  // Test about `shouldDisableYear` on the "year" view is on the `YearPicker` test file.
  describe('props.shouldDisableYear', () => {
    it('should disable all the dates on the "day" view when `shouldDisableYear` returns false for its year`', () => {
      render(
        <WrappedCalendarPicker
          initialValue={adapterToUse.date(new Date(2017, 11, 1))}
          shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
          views={['day']}
          openTo={'day'}
        />,
      );

      // No date should be disabled in the month before the disabled year
      screen.getAllByMuiTest('day').forEach((day) => {
        expect(day).not.to.have.attribute('disabled');
      });

      fireEvent.click(screen.getByTitle('Next month'));
      clock.runToLast();

      // All dates should be disabled in disabled year
      screen.getAllByMuiTest('day').forEach((day) => {
        expect(day).to.have.attribute('disabled');
      });
    });
  });
});
