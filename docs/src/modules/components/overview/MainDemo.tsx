import * as React from 'react';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightPicker from './mainDemo/FlightPicker';
import ThemeToggleGroup from './mainDemo/ThemeToggleGroup';
import Clock from './mainDemo/Clock';
import Birthday from './mainDemo/Birthday';
import DigitalClock from './mainDemo/DigitalClock';
import DateRangeWithShortcuts from './mainDemo/DateRangeWithShortcuts';
import PickerButton from './mainDemo/PickerButton';

export default function MainDemo() {
  const brandingTheme = useTheme();
  const isMobile = useMediaQuery(brandingTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(brandingTheme.breakpoints.up('md'));
  const isDesktop = useMediaQuery(brandingTheme.breakpoints.up('xl'));

  const [showCustomTheme, setShowCustomTheme] = React.useState(false);

  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper component="div" variant="outlined">
        <ThemeProvider theme={showCustomTheme ? brandingTheme : theme}>
          <Stack sx={{ p: 1, width: '100%' }} direction="row" spacing={1}>
            <Stack spacing={1} className="left-panel" sx={{ flexGrow: 1 }}>
              <Stack
                spacing={1}
                direction={isMobile ? 'column' : 'row'}
                sx={{ height: 'fit-content' }}
              >
                <ThemeToggleGroup
                  setShowCustomTheme={setShowCustomTheme}
                  showCustomTheme={showCustomTheme}
                />
                <FlightPicker />
              </Stack>
              <Stack spacing={1} direction="row" sx={{ flexGrow: 1 }}>
                <DateRangeWithShortcuts />
                {isTablet && (
                  <Stack spacing={1}>
                    <DigitalClock />
                    <PickerButton />
                  </Stack>
                )}
              </Stack>
            </Stack>
            {isDesktop && (
              <Stack spacing={1} className="right-panel" sx={{ flexGrow: 1 }}>
                <Clock />
                <Birthday />
              </Stack>
            )}
          </Stack>
        </ThemeProvider>
      </Paper>
    </LocalizationProvider>
  );
}
