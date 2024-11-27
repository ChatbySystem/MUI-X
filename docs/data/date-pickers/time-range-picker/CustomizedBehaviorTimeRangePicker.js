import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DigitalClockItem } from '@mui/x-date-pickers/DigitalClock';

function CustomDigitalClockItem(props) {
  const { rangePosition, selectedValue, formattedValue, itemValue, ...other } =
    props;
  if (selectedValue[0] && other?.['data-range-position'] === 'end') {
    const timeDifference = itemValue.diff(selectedValue[0], ['minutes']);
    const timeDifferenceLabel =
      timeDifference.minutes < 60
        ? timeDifference.toHuman()
        : timeDifference.shiftTo('hours').toHuman();
    return (
      <DigitalClockItem {...other}>
        {formattedValue} ({timeDifferenceLabel})
      </DigitalClockItem>
    );
  }
  return <DigitalClockItem {...other} />;
}

export default function CustomizedBehaviorTimeRangePicker() {
  const [rangePosition, setRangePosition] = React.useState('start');
  const [value, setValue] = React.useState([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <TimeRangePicker
          label="Event time"
          timeSteps={{ minutes: 15 }}
          value={value}
          onChange={setValue}
          minTime={value[0] ?? undefined}
          rangePosition={rangePosition}
          skipDisabled
          onRangePositionChange={setRangePosition}
          thresholdToRenderTimeInASingleColumn={96}
          format="HH:mm"
          ampm={false}
          slots={{
            digitalClockItem: CustomDigitalClockItem,
            field: SingleInputTimeRangeField,
          }}
          slotProps={{
            digitalClockItem: {
              rangePosition,
              selectedValue: value,
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
