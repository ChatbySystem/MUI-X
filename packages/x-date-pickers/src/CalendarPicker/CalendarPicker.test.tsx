import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  fireEvent,
  userEvent,
  screen,
  describeConformance,
  getAllByRole,
} from '@mui/monorepo/test/utils';
import {
  CalendarPicker,
  calendarPickerClasses as classes,
} from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  AdapterClassToUse,
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';

describe('<CalendarPicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<CalendarPicker date={adapterToUse.date()} onChange={() => {}} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiCalendarPicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: [
      'componentProp',
      'componentsProp',
      'propsSpread',
      'reactTestRenderer',
      // TODO: Fix CalendarPicker is not spreading props on root
      'themeDefaultProps',
      'themeVariants',
    ],
  }));

  it('renders calendar standalone', () => {
    render(
      <CalendarPicker date={adapterToUse.date('2019-01-01T00:00:00.000')} onChange={() => {}} />,
    );

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByMuiTest('day')).to.have.length(31);
    // It should follow https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
    expect(
      document.querySelector('[role="grid"] > [role="row"] > [role="cell"] > button'),
    ).to.have.text('1');
  });

  it('renders year selection standalone', () => {
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        openTo="year"
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByMuiTest('year')).to.have.length(200);
  });

  it('switches between views uncontrolled', () => {
    const handleViewChange = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={() => {}}
        onViewChange={handleViewChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));

    expect(handleViewChange.callCount).to.equal(1);
    expect(screen.queryByLabelText(/switch to year view/i)).to.equal(null);
    expect(screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  it('should allow month and view changing, but not selection when readOnly prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        readOnly
      />,
    );

    fireEvent.click(screen.getByTitle('Previous month'));
    expect(onMonthChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByTitle('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(2);

    fireEvent.click(screen.getByLabelText(/Jan 5, 2019/i));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('January 2019'));
    expect(screen.queryByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  it('should not allow interaction when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        disabled
      />,
    );

    fireEvent.click(screen.getByText('January 2019'));
    expect(screen.queryByText('January 2019')).toBeVisible();
    expect(screen.queryByLabelText('year view is open, switch to calendar view')).to.equal(null);

    fireEvent.click(screen.getByTitle('Previous month'));
    expect(onMonthChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByTitle('Next month'));
    expect(onMonthChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByLabelText(/Jan 5, 2019/i));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('should display disabled days when disabled prop is passed', () => {
    const onChangeMock = spy();
    const onMonthChangeMock = spy();
    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        disabled
      />,
    );

    // days are disabled
    const daysContainer = screen.getByRole('grid');
    const days = getAllByRole(daysContainer, 'button');
    const disabledDays = days.filter((day) => day.getAttribute('disabled') !== null);

    expect(days.length).to.equal(31);
    expect(disabledDays.length).to.equal(31);
  });

  it('renders header label text according to monthAndYear format', () => {
    render(
      <LocalizationProvider
        dateAdapter={AdapterClassToUse}
        dateFormats={{ monthAndYear: 'yyyy/MM' }}
      >
        <CalendarPicker date={adapterToUse.date('2019-01-01T00:00:00.000')} onChange={() => {}} />,
      </LocalizationProvider>,
    );

    expect(screen.getByText('2019/01')).toBeVisible();
  });

  it('should set time to be midnight when selecting a date without a previous date', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={null}
        onChange={onChange}
        defaultCalendarMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
        view="day"
      />,
    );

    userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-02T00:00:00.000'));
  });

  it('should keep the time of the currently provided date', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={adapterToUse.date('2018-01-03T11:11:11.111')}
        onChange={onChange}
        defaultCalendarMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
        view="day"
      />,
    );

    userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-02T11:11:11.000'));
  });

  it('should select the closest enabled date if selected date is disabled', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChange}
        maxDate={adapterToUse.date('2018-01-01T00:00:00.000')}
      />,
    );

    // onChange must be dispatched with newly selected date
    expect(onChange.callCount).to.equal(React.version.startsWith('18') ? 2 : 1); // Strict Effects run mount effects twice
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-01T00:00:00.000'));
  });

  it('should select the closest enabled date in the month when selecting a month but the current date is disabled', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChange}
        shouldDisableDate={(date) => {
          // Missing `getDate` in adapters
          // The following disable from Apr 1st to Apr 5th
          return (
            adapterToUse.getMonth(date) === 3 &&
            adapterToUse.getDiff(date, adapterToUse.startOfMonth(date), 'days') < 5
          );
        }}
        views={['month', 'day']}
        openTo="month"
      />,
    );

    const april = screen.getByText('Apr', { selector: 'button' });
    fireEvent.click(april);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2019-04-06T00:00:00.000'));
  });

  // TODO: Enable when the adapter will support startOfYear / endOfYear and the behavior of handleDateYearChange will match the one of handleDateMonthChange
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should select the closest enabled date in the year when selecting a year but the current date is disabled', () => {
    const onChange = spy();

    render(
      <CalendarPicker
        date={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChange}
        shouldDisableDate={(date) => {
          // The following disable from Jan 1st to Match 31st
          return adapterToUse.getYear(date) === 2024 && adapterToUse.getMonth(date) < 4;
        }}
        views={['year', 'day']}
        openTo="year"
      />,
    );

    const year2024 = screen.getByText('2024', { selector: 'button' });
    fireEvent.click(year2024);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2024-04-01T00:00:00.000'));
  });
});
