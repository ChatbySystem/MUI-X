import * as React from 'react';
import MUISwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/system';

function SwipeIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        pt: 2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 4,
          backgroundColor: 'grey.200',
          borderRadius: 4,
        }}
      />
    </Box>
  );
}

export function DrawerHeader(props) {
  const { children, ...other } = props;

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
      elevation={16}
      square
    >
      <Stack
        direction="row"
        px={2}
        py={2}
        gap={3}
        sx={{
          alignItems: 'center',
        }}
        {...other}
      >
        {children}
      </Stack>
    </Paper>
  );
}

export function Drawer(props) {
  const { children, anchor, width = 320, container, ...other } = props;
  const isBottomDrawer = anchor === 'bottom';
  const isTouch = useMediaQuery('(hover: none)');

  return (
    <MUISwipeableDrawer
      {...other}
      anchor={anchor}
      container={container}
      PaperProps={{
        sx: {
          position: 'absolute',
          boxSizing: 'border-box',
          ...(isBottomDrawer
            ? { pb: 1, maxHeight: 'calc(100% - 100px)' }
            : { width }),
        },
      }}
      ModalProps={{
        sx: { position: 'absolute' },
      }}
      slotProps={{
        backdrop: {
          sx: {
            position: 'absolute',
          },
        },
      }}
      disableSwipeToOpen
      onOpen={() => {}} // required by SwipeableDrawer but not used in this demo
    >
      {isTouch && isBottomDrawer && <SwipeIndicator />}
      {children}
    </MUISwipeableDrawer>
  );
}