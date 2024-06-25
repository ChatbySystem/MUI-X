import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

const ITEMS = Array.from({ length: 100 }).map((_, index) => ({
  id: `${index}`,
  label: `Item ${index}`,
  children: Array.from({ length: 100 }).map((_, index2) => ({
    id: `${index}-${index2}`,
    label: `Item ${index}-${index2}`,
  })),
}));

export default function BasicRichTreeView() {
  return (
    <Box sx={{ height: 352, minWidth: 250 }}>
      <RichTreeViewPro
        items={ITEMS}
        enableVirtualization
        defaultExpandedItems={ITEMS.map((el) => el.id)}
      />
    </Box>
  );
}
