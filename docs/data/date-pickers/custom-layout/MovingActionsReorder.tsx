import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import {
  pickersViewLayoutClasses,
  PickersViewLayoutContentWrapper,
  PickersViewLayoutProps,
  PickersViewLayoutRoot,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersViewLayout';
import { DateView } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

function ActionList(props: PickersActionBarProps) {
  const { onAccept, onClear, onCancel, onSetToday } = props;
  const actions = [
    { text: 'Accept', method: onAccept },
    { text: 'Clear', method: onClear },
    { text: 'Cancel', method: onCancel },
    { text: 'Today', method: onSetToday },
  ];
  return (
    <List>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

function CustomLayout(props: PickersViewLayoutProps<Dayjs | null, DateView>) {
  const { isLandscape } = props;
  const { toolbar, tabs, content, actionBar, classes } = usePickerLayout(props);

  return (
    <PickersViewLayoutRoot
      ownerState={{ isLandscape }}
      sx={{
        [`.${pickersViewLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
      }}
    >
      {toolbar}
      {actionBar}
      <PickersViewLayoutContentWrapper className={classes.contentWrapper}>
        {tabs}
        {content}
      </PickersViewLayoutContentWrapper>
    </PickersViewLayoutRoot>
  );
}

export default function MovingActionsReorder() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        components={{
          Layout: CustomLayout,
          ActionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
