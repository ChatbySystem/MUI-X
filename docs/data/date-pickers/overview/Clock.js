import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import {
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';

const StyledLayout = styled(PickersLayoutRoot)({
  overflow: 'auto',
  minWidth: 'fit-content',
  [`.${pickersLayoutClasses.toolbar}`]: {
    padding: `2px 8px`,
  },
  [`.${pickersLayoutClasses.contentWrapper}`]: {
    '& .MuiTimeClock-root': {
      width: 'fit-content',
    },
    '& .MuiPickersArrowSwitcher-root': {
      justifyContent: 'space-between',
      width: '100%',
      right: 0,
      top: '2px',
    },
  },
});

function CustomLayout(props) {
  const { actionBar, content, toolbar } = usePickerLayout(props);
  return (
    <StyledLayout ownerState={props}>
      {toolbar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {content}
        {actionBar}
      </PickersLayoutContentWrapper>
    </StyledLayout>
  );
}
export default function Clock() {
  return (
    <Card variant="outlined">
      <StaticTimePicker
        defaultValue={dayjs('2022-04-17T15:30')}
        slots={{ layout: CustomLayout }}
      />
    </Card>
  );
}
