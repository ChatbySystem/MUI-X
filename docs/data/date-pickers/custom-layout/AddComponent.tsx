import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const ActionList = (props: PickersActionBarProps) => {
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
};

const RestaurantHeader = () => (
  <Box
    sx={{
      // Place the element in the grid layout
      gridColumn: '1',
      gridRow: '1',
      // Center the icon
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <RestaurantIcon />
  </Box>
);

export default function AddComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDatePicker
        componentsProps={{
          layout: ({ toolbar, actionBar, content }) => ({
            sx: {
              // Keep the structure with display grid
              display: 'grid',
              gridAutoColumns: 'max-content auto max-content',
              gridAutoRows: 'max-content auto max-content',

              '& .MuiPickersViewLayout-actionbar': {
                gridColumn: '1',
                gridRow: '2',
              },
              '& .MuiPickersViewLayout-toolbar': {
                gridColumn: '2',
                gridRow: '1',
              },
            },
            children: [<RestaurantHeader />, toolbar, actionBar, content],
          }),
        }}
        components={{
          ActionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}
