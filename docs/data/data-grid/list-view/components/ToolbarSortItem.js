import * as React from 'react';
import {
  useGridApiContext,
  GridArrowUpwardIcon,
  GridArrowDownwardIcon,
  useGridSelector,
  gridSortModelSelector,
  gridColumnDefinitionsSelector,
} from '@mui/x-data-grid-premium';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { Drawer, DrawerHeader } from './Drawer';
import { ToolbarButton } from './ToolbarButton';

export function ToolbarSortItem(props) {
  const { listView, container } = props;
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const fields = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const sortableFields = fields.filter((field) => field.sortable);
  const activeSort = sortModel?.[0];

  const handleSortChange = (field, sort) => {
    apiRef.current.sortColumn(field, sort);
  };

  return (
    <React.Fragment>
      <ToolbarButton onClick={() => setOpen(true)}>
        <Badge badgeContent={activeSort ? 1 : 0} color="primary" variant="dot">
          <SwapVertIcon fontSize="small" />
        </Badge>
      </ToolbarButton>

      <Drawer
        anchor={listView ? 'bottom' : 'right'}
        open={open}
        container={container}
        onClose={() => setOpen(false)}
      >
        <DrawerHeader>
          <Typography fontWeight={500}>Sort by</Typography>
        </DrawerHeader>

        <List>
          {sortableFields.map((field) => {
            const isActive = activeSort?.field === field.field;
            let nextSort = 'asc';

            if (isActive) {
              nextSort = activeSort.sort === 'asc' ? 'desc' : null;
            }

            return (
              <ListItem key={field.field} disablePadding>
                <ListItemButton
                  onClick={() => handleSortChange(field.field, nextSort)}
                >
                  <ListItemIcon>
                    {isActive && (
                      <React.Fragment>
                        {activeSort.sort === 'asc' ? (
                          <GridArrowUpwardIcon />
                        ) : (
                          <GridArrowDownwardIcon />
                        )}
                      </React.Fragment>
                    )}
                  </ListItemIcon>
                  <ListItemText>{field.headerName}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </React.Fragment>
  );
}
