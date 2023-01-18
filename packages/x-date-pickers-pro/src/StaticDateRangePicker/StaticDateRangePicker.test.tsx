import * as React from 'react';
import { expect } from 'chai';
import { isWeekend } from 'date-fns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { describeConformance, screen } from '@mui/monorepo/test/utils';
import { wrapPickerMount, createPickerRenderer, adapterToUse } from 'test/utils/pickers-utils';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';

describe('<StaticDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<StaticDateRangePicker />, () => ({
    classes: {},
    muiName: 'MuiStaticDateRangePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: undefined,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'refForwarding',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeRangeValidation(StaticDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'static-picker',
    views: ['day'],
    variant: 'mobile',
  }));

  it('allows disabling dates', () => {
    render(
      <StaticDateRangePicker
        minDate={adapterToUse.date(new Date(2005, 0, 1))}
        shouldDisableDate={isWeekend}
        defaultValue={[
          adapterToUse.date(new Date(2018, 0, 1)),
          adapterToUse.date(new Date(2018, 0, 31)),
        ]}
      />,
    );

    expect(
      screen
        .getAllByMuiTest('DateRangePickerDay')
        .filter((day) => day.getAttribute('disabled') !== undefined),
    ).to.have.length(31);
  });

  it('should render the correct a11y tree structure', () => {
    render(
      <StaticDateRangePicker
        defaultValue={[
          adapterToUse.date(new Date(2018, 0, 1)),
          adapterToUse.date(new Date(2018, 0, 31)),
        ]}
      />,
    );

    // It should follow https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
    expect(
      document.querySelector(
        '[role="grid"] [role="rowgroup"] > [role="row"] button[role="gridcell"]',
      ),
    ).to.have.text('1');
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<StaticDateRangePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
