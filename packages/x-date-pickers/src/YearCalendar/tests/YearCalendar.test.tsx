import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { act, screen } from '@mui/internal-test-utils';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

describe('<YearCalendar />', () => {
  const { render, clock } = createPickerRenderer({ clockConfig: new Date(2019, 0, 1) });

  it('allows to pick year standalone by click, `Enter` and `Space`', async () => {
    const onChange = spy();
    const { user } = render(
      <YearCalendar value={adapterToUse.date('2019-02-02')} onChange={onChange} />,
    );
    const targetYear = screen.getByRole('radio', { name: '2025' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetYear.tagName).to.equal('BUTTON');

    await user.click(targetYear);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 1, 2));
  });

  it('should select start of year without time when no initial value is present', async () => {
    const onChange = spy();
    const { user } = render(<YearCalendar onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: '2025' }));

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 0, 1, 0, 0, 0, 0));
  });

  it('does not allow to pick year if readOnly prop is passed', async () => {
    const onChangeMock = spy();
    const { user } = render(
      <YearCalendar value={adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly />,
    );
    const targetYear = screen.getByRole('radio', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    await user.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });

  it('should display years in ascending (chronological order) by default', () => {
    render(
      <YearCalendar
        minDate={adapterToUse.date('2020-01-01')}
        maxDate={adapterToUse.date('2024-12-31')}
      />,
    );

    const yearButttons = screen.queryAllByTestId('year');
    expect(yearButttons[0].children.item(0)?.textContent).to.equal('2020');
  });

  it('should display years in descending (reverse chronological) order when props.yearsOrder = "desc"', () => {
    render(
      <YearCalendar
        minDate={adapterToUse.date('2020-01-01')}
        maxDate={adapterToUse.date('2024-12-31')}
        yearsOrder="desc"
      />,
    );

    const yearButtons = screen.queryAllByTestId('year');
    expect(yearButtons[0].children.item(0)?.textContent).to.equal('2024');
  });

  describe('Disabled', () => {
    it('should disable all years if props.disabled = true', async () => {
      const onChange = spy();
      const { user } = render(
        <YearCalendar value={adapterToUse.date('2017-02-15')} onChange={onChange} disabled />,
      );

      screen.getAllByRole('radio').forEach(async (monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        await user.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should not render years before props.minDate but should render and not disable the year in which props.minDate is', async () => {
      const onChange = spy();
      const { user } = render(
        <YearCalendar
          value={adapterToUse.date('2017-02-15')}
          onChange={onChange}
          minDate={adapterToUse.date('2018-02-12')}
        />,
      );

      const year2017 = screen.queryByText('2017', { selector: 'button' });
      const year2018 = screen.getByText('2018', { selector: 'button' });

      expect(year2017).to.equal(null);
      expect(year2018).not.to.have.attribute('disabled');

      await user.click(year2018);
      expect(onChange.callCount).to.equal(1);
    });

    it('should not render years after props.maxDate but should render and not disable the year in which props.maxDate is', async () => {
      const onChange = spy();
      const { user } = render(
        <YearCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          maxDate={adapterToUse.date('2025-04-12')}
        />,
      );

      const year2026 = screen.queryByText('2026', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2026).to.equal(null);
      expect(year2025).not.to.have.attribute('disabled');

      await user.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable years if props.shouldDisableYear returns true', async () => {
      const onChange = spy();
      const { user } = render(
        <YearCalendar
          value={adapterToUse.date('2019-01-02')}
          onChange={onChange}
          shouldDisableYear={(month) => adapterToUse.getYear(month) === 2024}
        />,
      );

      const year2024 = screen.getByText('2024', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2024).to.have.attribute('disabled');
      expect(year2025).not.to.have.attribute('disabled');

      await user.click(year2024);
      expect(onChange.callCount).to.equal(0);

      await user.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });
  });

  it('should allow to focus years when it contains valid date', async () => {
    const { user } = render(
      <YearCalendar
        // date is chose such as replacing year by 2018 or 2020 makes it out of valid range
        defaultValue={adapterToUse.date('2019-08-01')}
        autoFocus // needed to allow keyboard navigation
      />,
    );

    const button2019 = screen.getByRole('radio', { name: '2019' });

    act(() => button2019.focus());
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).to.have.text('2018');

    act(() => button2019.focus());
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).to.have.text('2020');
  });

  describe('with fake timers', () => {
    clock.withFakeTimers();

    it('should disable years after initial render when "disableFuture" prop changes', () => {
      const { setProps } = render(<YearCalendar />);

      const year2019 = screen.getByText('2019', { selector: 'button' });
      const year2020 = screen.getByText('2020', { selector: 'button' });

      expect(year2019).not.to.have.attribute('disabled');
      expect(year2020).not.to.have.attribute('disabled');

      setProps({ disableFuture: true });

      expect(year2019).not.to.have.attribute('disabled');
      expect(year2020).to.have.attribute('disabled');
    });
  });

  it('should not mark the `referenceDate` year as selected', () => {
    render(<YearCalendar referenceDate={adapterToUse.date('2018-02-02')} />);

    expect(screen.getByRole('radio', { name: '2018', checked: false })).not.to.equal(null);
  });
});
