import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  createPickerRenderer,
  adapterToUse,
  describeRangeValidation,
  setValueOnFieldInput,
} from '@mui/x-date-pickers/test/helpers';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDate'), setEndDate ? 1 : 0);
    },
  }));
});
